'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCart } from './Providers';
import Pic from './Pic';
import { Icon } from './Icons';
import { money } from '../lib/utils';

const EMAIL = /^[^\s@]+@[^\s@]+\.com$/i; // must end in .com
const PHONE = /^\+?[0-9]{9,15}$/;
const URL_ = process.env.NEXT_PUBLIC_SUPABASE_URL;
const KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

function loadPaystack() {
  return new Promise((res, rej) => {
    if (window.PaystackPop) return res();
    const s = document.createElement('script');
    s.src = 'https://js.paystack.co/v2/inline.js';
    s.onload = res;
    s.onerror = () => rej(new Error('Could not load Paystack. Check your connection and try again.'));
    document.body.appendChild(s);
  });
}

export default function CheckoutClient({ payments, branches }) {
  const { items, setQty, remove, clear, total } = useCart();
  const router = useRouter();
  const methods = [];
  if (payments.paystack.active && /^pk_(test|live)_/.test(payments.paystack.public_key || '')) methods.push(['paystack', payments.paystack.label]);
  if (payments.manual.active) methods.push(['manual', payments.manual.label]);

  const [f, setF] = useState({ name: '', phone: '', phone2: '', email: '', address: '', hp: '' });
  const [mode, setMode] = useState('delivery');
  const [branch, setBranch] = useState(branches[0]?.id || '');
  const [gateway, setGateway] = useState(methods[0]?.[0] || '');
  const [err, setErr] = useState({});
  const [msg, setMsg] = useState('');
  const [busy, setBusy] = useState(false);
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value });
  const clean = (v) => v.replace(/[\s-]/g, '');

  if (items.length === 0) {
    return (
      <div className="rounded-3xl bg-white p-10 text-center shadow">
        <h2 className="text-2xl font-bold">Your cart is empty</h2>
        <p className="mt-2 text-ink/60">Add a few dishes from the menu to get started.</p>
        <Link href="/menu" className="btn-red mt-6">Browse the menu</Link>
      </div>
    );
  }

  const submit = async (e) => {
    e.preventDefault();
    const x = {};
    if (f.name.trim().length < 2) x.name = 'Enter your full name.';
    if (!PHONE.test(clean(f.phone))) x.phone = 'Enter a valid number, like 0241234567 or +233241234567.';
    if (f.phone2 && !PHONE.test(clean(f.phone2))) x.phone2 = 'Enter a valid number or leave this empty.';
    if (!EMAIL.test(f.email.trim())) x.email = 'Enter an email ending in .com, like name@gmail.com.';
    if (mode === 'delivery' && f.address.trim().length < 5) x.address = 'Enter your delivery address.';
    if (mode === 'pickup' && !branch) x.branch = 'Choose a branch for pickup.';
    if (!gateway) x.gateway = 'No payment method is available right now.';
    setErr(x);
    if (Object.keys(x).length) return;
    if (!URL_ || !KEY) { setMsg('Ordering is not switched on yet. Please call us to order.'); return; }

    setBusy(true); setMsg('');
    try {
      const r = await fetch(URL_ + '/functions/v1/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', apikey: KEY, Authorization: 'Bearer ' + KEY },
        body: JSON.stringify({
          name: f.name.trim(), phone: clean(f.phone), phone2: clean(f.phone2), email: f.email.trim(), hp: f.hp,
          fulfilment: mode, address: mode === 'delivery' ? f.address.trim() : '', branch_id: mode === 'pickup' ? Number(branch) : null,
          gateway, items: items.map((i) => ({ id: i.id, qty: i.qty })),
        }),
      });
      const d = await r.json();
      if (!r.ok) throw new Error(d.error || 'Could not place your order. Please try again.');

      if (gateway === 'paystack') {
        await loadPaystack();
        new window.PaystackPop().newTransaction({
          key: payments.paystack.public_key, email: d.email, amount: d.amount, currency: 'GHS', ref: d.reference,
          onSuccess: () => { clear(); router.push('/order?ref=' + d.reference); },
          onCancel: () => { setBusy(false); setMsg('Payment was cancelled. You can try again.'); },
          onError: () => { setBusy(false); setMsg('Payment failed. Please try again.'); },
        });
      } else {
        clear();
        router.push('/order?ref=' + d.reference);
      }
    } catch (ex) {
      setBusy(false);
      setMsg(ex.message || 'Something went wrong. Please try again.');
    }
  };

  const E = ({ k }) => (err[k] ? <p className="mt-1 text-sm font-bold text-brand">{err[k]}</p> : null);
  const lab = 'block text-sm font-bold';
  const tab = (on) => 'flex-1 rounded-xl px-4 py-3 text-center font-bold transition ' + (on ? 'bg-brand text-white shadow' : 'text-ink/60 hover:text-ink');

  return (
    <form onSubmit={submit} noValidate className="grid items-start gap-6 lg:grid-cols-[1fr_380px]">
      <div className="space-y-6">
        <div className="rounded-3xl bg-white p-6 shadow">
          <h2 className="text-xl font-bold">Your details</h2>
          <div className="hidden" aria-hidden="true"><input tabIndex={-1} autoComplete="off" name="website" value={f.hp} onChange={set('hp')} /></div>
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            <label className={lab + ' md:col-span-2'}>Full name *<input className="field mt-1 font-normal" autoComplete="name" placeholder="Kwame Mensah" maxLength={80} value={f.name} onChange={set('name')} /><E k="name" /></label>
            <label className={lab}>Phone number *<input className="field mt-1 font-normal" type="tel" autoComplete="tel" placeholder="0241234567" maxLength={18} value={f.phone} onChange={set('phone')} /><E k="phone" /></label>
            <label className={lab}>Second number (optional)<input className="field mt-1 font-normal" type="tel" placeholder="0501234567" maxLength={18} value={f.phone2} onChange={set('phone2')} /><E k="phone2" /></label>
            <label className={lab + ' md:col-span-2'}>Email address *<input className="field mt-1 font-normal" type="email" autoComplete="email" placeholder="name@gmail.com" maxLength={120} value={f.email} onChange={set('email')} /><E k="email" /></label>
          </div>
        </div>

        <div className="rounded-3xl bg-white p-6 shadow">
          <h2 className="text-xl font-bold">How do you want your order?</h2>
          <div className="mt-4 flex gap-1 rounded-2xl bg-paper p-1" role="tablist">
            <button type="button" className={tab(mode === 'delivery')} onClick={() => setMode('delivery')}>Delivery</button>
            <button type="button" className={tab(mode === 'pickup')} onClick={() => setMode('pickup')}>Pickup</button>
          </div>
          {mode === 'delivery'
            ? <label className={lab + ' mt-4'}>Delivery address *<textarea className="field mt-1 font-normal" rows={3} placeholder="House number, street, landmark, area" maxLength={250} value={f.address} onChange={set('address')} /><E k="address" /></label>
            : <label className={lab + ' mt-4'}>Pickup branch *
                <select className="field mt-1 font-normal" value={branch} onChange={(e) => setBranch(e.target.value)}>
                  {branches.map((b) => <option key={b.id} value={b.id}>{b.name} - {b.address}</option>)}
                </select><E k="branch" /></label>}
        </div>

        <div className="rounded-3xl bg-white p-6 shadow">
          <h2 className="text-xl font-bold">Payment</h2>
          <div className="mt-4 space-y-3">
            {methods.map(([id, label]) => (
              <label key={id} className={'flex cursor-pointer items-center gap-3 rounded-2xl border-2 p-4 transition ' + (gateway === id ? 'border-brand bg-brand/5' : 'border-ink/10')}>
                <input type="radio" name="gw" className="accent-[#E10600]" checked={gateway === id} onChange={() => setGateway(id)} />
                <span className="font-bold">{label}</span>
              </label>
            ))}
            {gateway === 'manual' && <p className="rounded-2xl bg-sun/20 p-4 text-sm">You will get the payment instructions and your order reference on the next page.</p>}
            <E k="gateway" />
          </div>
        </div>
      </div>

      <aside className="rounded-3xl bg-white p-6 shadow lg:sticky lg:top-28">
        <h2 className="text-xl font-bold">Order summary</h2>
        <ul className="mt-4 divide-y divide-ink/10">
          {items.map((i) => (
            <li key={i.id} className="flex gap-3 py-3">
              <Pic src={i.image} alt={i.title} className="h-16 w-16 shrink-0 rounded-xl" />
              <div className="min-w-0 flex-1">
                <p className="truncate font-bold">{i.title}</p>
                <p className="text-sm text-brand">{money(i.price)}</p>
                <div className="mt-1 inline-flex items-center rounded-full border border-ink/15">
                  <button type="button" className="px-3 py-1" onClick={() => setQty(i.id, i.qty - 1)} aria-label="Less">&minus;</button>
                  <span className="w-6 text-center text-sm font-bold">{i.qty}</span>
                  <button type="button" className="px-3 py-1" onClick={() => setQty(i.id, i.qty + 1)} aria-label="More">+</button>
                </div>
              </div>
              <button type="button" onClick={() => remove(i.id)} className="self-start p-1 text-ink/40 hover:text-brand" aria-label={'Remove ' + i.title}><Icon name="x" size={18} /></button>
            </li>
          ))}
        </ul>
        <div className="mt-4 flex items-center justify-between border-t border-ink/10 pt-4">
          <span className="font-bold">Total</span>
          <span className="font-display text-2xl font-black text-brand">{money(total)}</span>
        </div>
        {msg && <p role="alert" className="mt-4 rounded-xl bg-brand/10 p-3 text-sm font-bold text-brand">{msg}</p>}
        <button className="btn-red mt-5 w-full disabled:opacity-60" disabled={busy || !gateway}>{busy ? 'Please wait...' : gateway === 'paystack' ? 'Pay with Paystack' : 'Place order'}</button>
      </aside>
    </form>
  );
}
