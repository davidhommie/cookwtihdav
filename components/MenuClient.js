'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from './Providers';
import Pic from './Pic';
import { Icon, Stars } from './Icons';
import { money } from '../lib/utils';

export default function MenuClient({ items }) {
  const cats = ['All', ...Array.from(new Set(items.map((i) => i.category).filter(Boolean)))];
  const [cat, setCat] = useState('All');
  const [sel, setSel] = useState(null);
  const [toast, setToast] = useState('');
  const { add } = useCart();
  const router = useRouter();
  const list = cat === 'All' ? items : items.filter((i) => i.category === cat);

  useEffect(() => {
    if (!sel) return;
    const k = (e) => e.key === 'Escape' && setSel(null);
    window.addEventListener('keydown', k);
    document.body.style.overflow = 'hidden';
    return () => { window.removeEventListener('keydown', k); document.body.style.overflow = ''; };
  }, [sel]);

  const addItem = (it) => {
    add({ id: it.id, title: it.title, price: it.price, image: (it.images || [])[0] || '' });
    setToast(it.title + ' added to cart');
    setTimeout(() => setToast(''), 1800);
  };

  return (
    <section className="mx-auto max-w-7xl px-4 py-12">
      <div className="flex flex-wrap justify-center gap-2">
        {cats.map((c) => (
          <button key={c} onClick={() => setCat(c)} className={'rounded-full border px-5 py-2 text-sm font-bold transition ' + (cat === c ? 'border-brand bg-brand text-white' : 'border-ink/15 bg-white hover:border-brand hover:text-brand')}>{c}</button>
        ))}
      </div>

      <div className="mt-10 grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-6 lg:grid-cols-4">
        {list.map((it) => (
          <div key={it.id} className="group relative overflow-hidden rounded-2xl bg-white shadow transition hover:-translate-y-1 hover:shadow-lg">
            <button onClick={() => setSel(it)} className="block w-full text-left" aria-label={'View ' + it.title}>
              <div className="relative overflow-hidden">
                <Pic src={(it.images || [])[0]} alt={it.title} className="aspect-[4/3] w-full transition duration-500 group-hover:scale-105" />
                {it.popular && <span className="absolute left-2 top-2 rounded-full bg-brand px-2.5 py-0.5 text-xs font-bold text-white">Popular</span>}
              </div>
              <div className="p-3 pb-14 md:p-4 md:pb-14">
                <Stars rating={it.rating} />
                <h3 className="mt-1 font-body text-sm font-black leading-snug md:text-base">{it.title}</h3>
                <p className="mt-1 line-clamp-2 text-xs text-ink/60 md:text-sm">{it.description}</p>
              </div>
            </button>
            <div className="absolute inset-x-3 bottom-3 flex items-center justify-between md:inset-x-4">
              <span className="font-black text-brand">{money(it.price)}</span>
              <button onClick={() => addItem(it)} className="grid h-9 w-9 place-items-center rounded-full bg-brand text-white transition hover:scale-110 hover:bg-brand-dark" aria-label={'Add ' + it.title + ' to cart'}><Icon name="cart" size={18} /></button>
            </div>
          </div>
        ))}
      </div>

      {toast && <div role="status" className="rise fixed bottom-6 left-1/2 z-[60] -translate-x-1/2 rounded-full bg-ink px-5 py-3 text-sm font-bold text-white shadow-lg">{toast}</div>}

      {sel && (
        <div className="fixed inset-0 z-[70] grid place-items-center bg-ink/70 p-4" onClick={() => setSel(null)} role="dialog" aria-modal="true" aria-label={sel.title}>
          <div className="rise relative grid max-h-[90vh] w-full max-w-3xl overflow-auto rounded-3xl bg-white md:grid-cols-2" onClick={(e) => e.stopPropagation()}>
            <button onClick={() => setSel(null)} className="absolute right-3 top-3 z-10 grid h-9 w-9 place-items-center rounded-full bg-white/90 shadow" aria-label="Close"><Icon name="x" size={18} /></button>
            <Pic src={(sel.images || [])[0]} alt={sel.title} className="aspect-square h-full w-full" />
            <div className="flex flex-col p-6">
              {sel.category && <span className="w-fit rounded-full bg-paper px-3 py-1 text-xs font-bold text-ink/60">{sel.category}</span>}
              <h3 className="mt-3 text-2xl font-bold">{sel.title}</h3>
              <div className="mt-2"><Stars rating={sel.rating} /></div>
              <p className="mt-4 text-ink/70">{sel.description}</p>
              <p className="mt-5 font-display text-3xl font-black text-brand">{money(sel.price)}</p>
              <div className="mt-auto flex flex-wrap gap-3 pt-6">
                <button className="btn-red flex-1" onClick={() => { addItem(sel); setSel(null); router.push('/checkout'); }}>Order now</button>
                <button className="btn flex-1 border-2 border-brand text-brand hover:bg-brand hover:text-white" onClick={() => { addItem(sel); setSel(null); }}><Icon name="cart" size={18} /> Add to cart</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
