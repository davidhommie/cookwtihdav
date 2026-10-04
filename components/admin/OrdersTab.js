'use client';
import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { money } from '../../lib/utils';

const STATUS = ['pending', 'paid', 'delivered', 'cancelled'];
const tone = { pending: 'bg-sun text-ink', paid: 'bg-green-100 text-green-800', delivered: 'bg-blue-100 text-blue-800', cancelled: 'bg-ink/10 text-ink/60' };
const wa = (p) => { let d = String(p).replace(/\D/g, ''); if (d.startsWith('0')) d = '233' + d.slice(1); return 'https://wa.me/' + d; };

export default function OrdersTab({ toast }) {
  const [rows, setRows] = useState(null);
  const [f, setF] = useState('all');
  const load = async () => {
    const { data, error } = await supabase.from('orders').select('*, branches(name)').order('created_at', { ascending: false }).limit(100);
    if (error) toast(error.message, true);
    setRows(data || []);
  };
  useEffect(() => { load(); }, []);
  if (!rows) return <p className="text-ink/50">Loading...</p>;

  const setStatus = async (id, status) => {
    const { error } = await supabase.from('orders').update({ status }).eq('id', id);
    toast(error ? error.message : 'Order marked ' + status + '.', !!error); load();
  };
  const list = f === 'all' ? rows : rows.filter((o) => o.status === f);

  return (
    <div>
      <div className="mb-5 flex flex-wrap gap-2">
        {['all', ...STATUS].map((s) => <button key={s} onClick={() => setF(s)} className={'rounded-full px-4 py-1.5 text-sm font-bold capitalize ' + (f === s ? 'bg-brand text-white' : 'bg-white border border-ink/15')}>{s}</button>)}
        <button onClick={load} className="ml-auto text-sm font-bold text-brand">Refresh</button>
      </div>
      {list.length === 0 && <p className="text-ink/50">No orders here yet.</p>}
      <div className="space-y-4">
        {list.map((o) => (
          <div key={o.id} className="rounded-2xl border border-ink/10 bg-white p-5">
            <div className="flex flex-wrap items-center gap-3">
              <span className={'rounded-full px-3 py-1 text-xs font-bold capitalize ' + tone[o.status]}>{o.status}</span>
              <span className="font-mono text-sm">{o.reference}</span>
              <span className="text-sm text-ink/50">{new Date(o.created_at).toLocaleString()}</span>
              <span className="ml-auto font-display text-xl font-black text-brand">{money(o.amount)}</span>
            </div>
            <div className="mt-3 grid gap-3 text-sm md:grid-cols-2">
              <div>
                <p className="font-black">{o.customer_name}</p>
                <p><a className="text-brand" href={'tel:' + o.phone}>{o.phone}</a>{o.phone2 ? ' / ' + o.phone2 : ''} - <a className="text-brand" href={wa(o.phone)} target="_blank" rel="noopener noreferrer">WhatsApp</a></p>
                <p>{o.email}</p>
                <p className="mt-1">{o.fulfilment === 'delivery' ? 'Deliver to: ' + o.address : 'Pickup at: ' + (o.branches?.name || 'branch')}</p>
                <p className="text-ink/50">Payment: {o.gateway === 'paystack' ? 'Paystack' : 'Direct send'}</p>
              </div>
              <ul>{(o.items || []).map((i, k) => <li key={k}>{i.qty} x {i.title}</li>)}</ul>
            </div>
            <div className="mt-4 flex flex-wrap gap-2 border-t border-ink/10 pt-4">
              {STATUS.filter((s) => s !== o.status).map((s) => <button key={s} onClick={() => setStatus(o.id, s)} className="rounded-lg border border-ink/20 px-3 py-1.5 text-sm font-bold capitalize hover:border-brand hover:text-brand">Mark {s}</button>)}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
