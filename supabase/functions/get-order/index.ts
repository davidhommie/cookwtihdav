// Supabase Edge Function: get-order. Paste into the dashboard editor as ONE file (index.ts).
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const cors = { "Access-Control-Allow-Origin": "*", "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type", "Access-Control-Allow-Methods": "POST, OPTIONS" };
const json = (b: unknown, s = 200) => new Response(JSON.stringify(b), { status: s, headers: { ...cors, "Content-Type": "application/json" } });

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: cors });
  try {
    const { ref } = await req.json();
    if (!/^cwd_[0-9a-f]{24}$/.test(String(ref || ""))) return json({ error: "Not found" }, 404);
    const db = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);
    const { data: o } = await db.from("orders").select("reference,status,gateway,items,amount,fulfilment,email,branch_id").eq("reference", ref).maybeSingle();
    if (!o) return json({ error: "Not found" }, 404);
    let branch = "";
    if (o.branch_id) { const { data: b } = await db.from("branches").select("name").eq("id", o.branch_id).maybeSingle(); branch = b?.name || ""; }
    const [u, d] = String(o.email).split("@");
    return json({ reference: o.reference, status: o.status, gateway: o.gateway, items: o.items, amount: Number(o.amount), fulfilment: o.fulfilment, branch, email: u.slice(0, 2) + "***@" + d });
  } catch (_) {
    return json({ error: "Not found" }, 404);
  }
});
