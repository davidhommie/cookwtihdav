'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Brand } from './Icons';
import { money, waLink } from '../lib/utils';

const URL_ = process.env.NEXT_PUBLIC_SUPABASE_URL;
const KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export default function OrderClient({ instructions, phone, wa }) {
  const ref = useSearchParams().get('ref') || '';
  const [o, setO] = useState(null);
  const [state, setState] = useState('loading'); // loading | ok | missing

  useEffect(() => {
    if (!/^cwd_[0-9a-f]{24}$/.test(ref) || !URL_) { setState('missing'); return; }
    let stop = false, timer;
    const load = async () => {
      try {
        const r = await fetch(URL_ + '/functions/v1/get-order', { method: 'POST', headers: { 'Content-Type': 'application/json', apikey: KEY, Authorization: 'Bearer ' + KEY }, body: JSON.stringify({ ref }) });
        const d = await r.json();
        if (stop) return;
        if (!r.ok) { setState('missing'); return; }
        setO(d); setState('ok');
        if (d.status === 'pending' && d.gateway === 'paystack') timer = setTimeout(load, 4000); // wait for payment confirmation
      } catch (e) { if (!stop) setState('missing'); }
    };
    load();
    return () => { stop = true; clearTimeout(timer); };
  }, [ref]);

  if (state === 'loading') return <p className="text-center text-ink/60">Loading your order...</p>;
  if (state === 'missing' || !o) return (
    <div className="rounded-3xl bg-white p-10 text-center shadow">
      <h1 className="text-2xl font-bold">We could not find that order</h1>
      <p className="mt-2 text-ink/60">Check the link, or call us on {phone}.</p>
      <Link href="/menu" className="btn-red mt-6">Back to the menu</Link>
    </div>
  );

  const paid = o.status !== 'pending';
  return (
    <div className="rise rounded-3xl bg-white p-6 shadow md:p-8">
      <span className={'inline-block rounded-full px-4 py-1 text-sm font-bold ' + (paid ? 'bg-green-100 text-green-800' : 'bg-sun text-ink')}>{o.status === 'pending' ? (o.gateway === 'paystack' ? 'Confirming your payment' : 'Waiting for your payment') : o.status === 'cancelled' ? 'Cancelled' : 'Payment received'}</span>
      <h1 className="mt-4 text-3xl font-black">{paid ? 'Thank you for your order' : 'Order placed'}</h1>
      <p className="mt-1 text-ink/60">Reference: <span className="font-bold text-ink">{o.reference}</span></p>
      <p className="text-sm text-ink/60">A confirmation was sent to {o.email}.</p>

      {o.status === 'pending' && o.gateway === 'manual' && (
        <div className="mt-6 rounded-2xl bg-sun/20 p-5">
          <h2 className="font-body text-lg font-black">How to pay</h2>
          <p className="mt-2 whitespace-pre-line">{instructions}</p>
          <p className="mt-3 font-bold">Amount to send: {money(o.amount)}</p>
          <p className="font-bold">Payment reference: {o.reference}</p>
        </div>
      )}
      {o.status === 'pending' && o.gateway === 'paystack' && <p className="mt-6 rounded-2xl bg-sun/20 p-5">We are confirming your payment. This page updates by itself.</p>}

      <ul className="mt-6 divide-y divide-ink/10 border-y border-ink/10">
        {o.items.map((i, k) => (
          <li key={k} className="flex justify-between py-3"><span>{i.qty} x {i.title}</span><span className="font-bold">{money(i.price * i.qty)}</span></li>
        ))}
      </ul>
      <p className="mt-4 flex justify-between text-lg font-black"><span>Total</span><span className="text-brand">{money(o.amount)}</span></p>
      <p className="mt-4 text-sm text-ink/60">{o.fulfilment === 'delivery' ? 'Delivery order' : 'Pickup at ' + (o.branch || 'your chosen branch')}</p>
      <div className="mt-6 flex flex-wrap gap-3">
        <a href={waLink(wa, 'Hello! I just placed order ' + o.reference + ' (' + money(o.amount) + '). Please confirm.')} target="_blank" rel="noopener noreferrer" className="btn bg-[#25D366] text-white hover:brightness-95"><Brand name="whatsapp" size={20} /> Confirm on WhatsApp</a>
        <Link href="/menu" className="btn-red">Order more</Link>
      </div>
    </div>
  );
}
