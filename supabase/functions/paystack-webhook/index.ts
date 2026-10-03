// Supabase Edge Function: paystack-webhook. ONE file. In its Settings, turn OFF "Verify JWT".
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const esc = (s: unknown) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c] as string));
const money = (n: number) => "GH\u20B5 " + n.toFixed(2);

async function mail(to: string, subject: string, html: string) {
  const key = Deno.env.get("RESEND_API_KEY");
  if (!key || !to) return;
  try {
    await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: "Bearer " + key, "Content-Type": "application/json" },
      body: JSON.stringify({ from: Deno.env.get("FROM_EMAIL") || "cookwithdavid <onboarding@resend.dev>", to: [to], subject, html }),
    });
  } catch (_) { /* ignore */ }
}

async function validSignature(body: string, sig: string, secret: string) {
  const key = await crypto.subtle.importKey("raw", new TextEncoder().encode(secret), { name: "HMAC", hash: "SHA-512" }, false, ["sign"]);
  const mac = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(body));
  const hex = Array.from(new Uint8Array(mac)).map((x) => x.toString(16).padStart(2, "0")).join("");
  return hex === sig;
}

Deno.serve(async (req) => {
  try {
    const raw = await req.text();
    const secret = Deno.env.get("PAYSTACK_SECRET_KEY") || "";
    if (!secret || !(await validSignature(raw, req.headers.get("x-paystack-signature") || "", secret))) return new Response("invalid", { status: 401 });
    const ev = JSON.parse(raw);
    if (ev.event !== "charge.success") return new Response("ok");

    const db = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);
    const ref = String(ev.data?.reference || "");
    const { data: o } = await db.from("orders").select("*").eq("reference", ref).maybeSingle();
    if (!o) return new Response("ok");
    // the amount and currency must match what we expect
    if (ev.data.currency !== "GHS" || Number(ev.data.amount) !== Math.round(Number(o.amount) * 100)) return new Response("mismatch", { status: 400 });

    // moves pending -> paid once; a repeat webhook finds no pending row and does nothing
    const { data: done } = await db.from("orders").update({ status: "paid" }).eq("reference", ref).eq("status", "pending").select("reference");
    if (!done || done.length === 0) return new Response("ok");

    const rows = (o.items as any[]).map((l) => `<li>${l.qty} x ${esc(l.title)} - ${money(l.price * l.qty)}</li>`).join("");
    const site = (Deno.env.get("SITE_URL") || "").replace(/\/$/, "");
    await mail(o.email, "Payment received - " + ref, `<h2>Payment received</h2><p>Thank you, ${esc(o.customer_name)}. We are on it.</p><ul>${rows}</ul><p><b>Total ${money(Number(o.amount))}</b></p>` + (site ? `<p><a href="${site}/order?ref=${ref}">View your order</a></p>` : ""));
    const admin = Deno.env.get("ADMIN_EMAIL");
    if (admin) await mail(admin, "Paid order " + ref, `<h2>Payment received</h2><p>${esc(o.customer_name)} - ${esc(o.phone)}<br>${esc(o.email)}</p><ul>${rows}</ul><p><b>Total ${money(Number(o.amount))}</b></p><p>${o.fulfilment === "delivery" ? "Delivery to: " + esc(o.address) : "Pickup order"}</p>`);
    return new Response("ok");
  } catch (_) {
    return new Response("error", { status: 500 });
  }
});
