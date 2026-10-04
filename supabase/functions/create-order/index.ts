// Supabase Edge Function: create-order. Paste into the dashboard editor as ONE file (index.ts).
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const cors = { "Access-Control-Allow-Origin": "*", "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type", "Access-Control-Allow-Methods": "POST, OPTIONS" };
const json = (b: unknown, s = 200) => new Response(JSON.stringify(b), { status: s, headers: { ...cors, "Content-Type": "application/json" } });
const esc = (s: unknown) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c] as string));
const money = (n: number) => "GH\u20B5 " + n.toFixed(2);

async function mail(to: string, subject: string, html: string) {
  const key = Deno.env.get("RESEND_API_KEY");
  if (!key || !to) { console.error("Email skipped: RESEND_API_KEY or the recipient is missing"); return; }
  try {
    const r = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: "Bearer " + key, "Content-Type": "application/json" },
      body: JSON.stringify({ from: Deno.env.get("FROM_EMAIL") || "cookwithdavid <onboarding@resend.dev>", to: [to], subject, html }),
    });
    if (!r.ok) console.error("Resend rejected the email:", r.status, await r.text()); // visible in the function Logs
  } catch (e) { console.error("Resend request failed:", String(e)); }
}

async function tg(text: string) {
  const token = Deno.env.get("TELEGRAM_BOT_TOKEN"), chat = Deno.env.get("TELEGRAM_CHAT_ID");
  if (!token || !chat) return;
  try {
    const r = await fetch("https://api.telegram.org/bot" + token + "/sendMessage", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chat_id: chat, text, parse_mode: "HTML", disable_web_page_preview: true }),
    });
    if (!r.ok) console.error("Telegram rejected the message:", r.status, await r.text());
  } catch (e) { console.error("Telegram request failed:", String(e)); }
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: cors });
  try {
    if (req.method !== "POST") return json({ error: "Method not allowed" }, 405);
    const b = await req.json();
    if (b.hp) return json({ error: "Could not place your order." }, 400); // honeypot

    const name = String(b.name || "").trim();
    const email = String(b.email || "").trim();
    const phone = String(b.phone || "").replace(/[\s-]/g, "");
    const phone2 = String(b.phone2 || "").replace(/[\s-]/g, "");
    const fulfilment = b.fulfilment === "pickup" ? "pickup" : "delivery";
    const address = String(b.address || "").trim();
    const gateway = b.gateway === "paystack" ? "paystack" : "manual";
    const P = /^\+?[0-9]{9,15}$/;
    if (name.length < 2 || name.length > 80) return json({ error: "Enter your full name." }, 400);
    if (!/^[^\s@]+@[^\s@]+\.com$/i.test(email) || email.length > 120) return json({ error: "Enter an email ending in .com." }, 400);
    if (!P.test(phone)) return json({ error: "Enter a valid phone number." }, 400);
    if (phone2 && !P.test(phone2)) return json({ error: "Enter a valid second number or leave it empty." }, 400);
    if (fulfilment === "delivery" && (address.length < 5 || address.length > 250)) return json({ error: "Enter your delivery address." }, 400);

    const items = Array.isArray(b.items) ? b.items : [];
    if (items.length < 1 || items.length > 20) return json({ error: "Your cart is empty." }, 400);
    const want: Record<number, number> = {};
    for (const i of items) {
      const id = Number(i.id), qty = Number(i.qty);
      if (!Number.isInteger(id) || !Number.isInteger(qty) || qty < 1 || qty > 10) return json({ error: "Invalid cart." }, 400);
      want[id] = (want[id] || 0) + qty;
    }

    const db = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);

    // rate limit: 8 orders per IP per 10 minutes
    const ip = (req.headers.get("x-forwarded-for") || "unknown").split(",")[0].trim();
    const since = new Date(Date.now() - 10 * 60 * 1000).toISOString();
    const { count } = await db.from("orders").select("id", { count: "exact", head: true }).eq("ip", ip).gte("created_at", since);
    if ((count || 0) >= 8) return json({ error: "Too many orders. Please wait a few minutes." }, 429);

    // prices always come from the database, never from the browser
    const { data: menu } = await db.from("menu_items").select("id,title,price").in("id", Object.keys(want).map(Number)).eq("active", true);
    if (!menu || menu.length !== Object.keys(want).length) return json({ error: "Some items are no longer available. Please refresh the menu." }, 400);
    const lines = menu.map((m: any) => ({ id: m.id, title: m.title, price: Number(m.price), qty: want[m.id] }));
    const amount = Math.round(lines.reduce((n, l) => n + l.price * l.qty, 0) * 100) / 100;

    let branchId: number | null = null, branchName = "";
    if (fulfilment === "pickup") {
      const { data: br } = await db.from("branches").select("id,name").eq("id", Number(b.branch_id)).eq("active", true).maybeSingle();
      if (!br) return json({ error: "Choose a pickup branch." }, 400);
      branchId = br.id; branchName = br.name;
    }

    const rb = new Uint8Array(12); crypto.getRandomValues(rb);
    const reference = "cwd_" + Array.from(rb).map((x) => x.toString(16).padStart(2, "0")).join("");

    const { error } = await db.from("orders").insert({
      reference, customer_name: name, phone, phone2: phone2 || null, email, fulfilment, address: fulfilment === "delivery" ? address : null,
      branch_id: branchId, items: lines, amount, gateway, status: "pending", ip,
    });
    if (error) return json({ error: "Could not save your order. Please try again." }, 500);

    const site = (Deno.env.get("SITE_URL") || "").replace(/\/$/, "");
    const rows = lines.map((l) => `<li>${l.qty} x ${esc(l.title)} - ${money(l.price * l.qty)}</li>`).join("");
    const where = fulfilment === "delivery" ? "Delivery to: " + esc(address) : "Pickup at: " + esc(branchName);
    const admin = Deno.env.get("ADMIN_EMAIL");
    if (gateway === "manual" && admin) {
      await mail(admin, "New order " + reference, `<h2>New order (awaiting direct payment)</h2><p>${esc(name)} - ${esc(phone)}${phone2 ? " / " + esc(phone2) : ""}<br>${esc(email)}</p><ul>${rows}</ul><p><b>Total ${money(amount)}</b></p><p>${where}</p><p>Reference: ${reference}</p>`);
    }
    if (gateway === "manual") await tg(`<b>New order (direct send, awaiting payment)</b>\n${esc(reference)}\n${esc(name)} - ${esc(phone)}\n${lines.map((l) => l.qty + " x " + esc(l.title)).join("\n")}\nTotal ${money(amount)}\n${where}`);
    await mail(email, "We got your order - " + reference, `<h2>Thank you, ${esc(name)}</h2><ul>${rows}</ul><p><b>Total ${money(amount)}</b></p><p>${where}</p><p>Reference: <b>${reference}</b></p>` + (site ? `<p><a href="${site}/order?ref=${reference}">View your order</a></p>` : ""));

    return json({ reference, email, amount: Math.round(amount * 100) });
  } catch (_) {
    return json({ error: "Something went wrong. Please try again." }, 500);
  }
});
