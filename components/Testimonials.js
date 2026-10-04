'use client';
import { useEffect, useState } from 'react';
import { Icon, Stars } from './Icons';

export default function Testimonials({ items }) {
  const [i, setI] = useState(0);
  const n = items.length;
  useEffect(() => {
    if (n < 2) return;
    const t = setInterval(() => setI((x) => (x + 1) % n), 6500);
    return () => clearInterval(t);
  }, [n, i]);
  if (!n) return null;
  const t = items[i % n];
  const arrow = 'absolute top-1/2 z-10 grid h-11 w-11 -translate-y-1/2 place-items-center rounded-full bg-white shadow-lg transition hover:bg-brand hover:text-white';
  return (
    <div className="relative mx-auto max-w-3xl">
      {n > 1 && <button className={arrow + ' -left-3 md:-left-16'} onClick={() => setI((i - 1 + n) % n)} aria-label="Previous review"><Icon name="chev" className="rotate-90" /></button>}
      <div key={i} className="rise rounded-3xl bg-white p-8 text-center shadow-lg md:p-12">
        <span className="font-display text-7xl leading-none text-brand/25">&ldquo;</span>
        <div className="flex justify-center"><Stars rating={t.rating || 5} /></div>
        <p className="mt-5 text-xl italic text-ink/80 md:text-2xl">{t.text}</p>
        <p className="mt-6 font-black">{t.name}</p>
        <p className="text-ink/50">{t.role}</p>
      </div>
      {n > 1 && <button className={arrow + ' -right-3 md:-right-16'} onClick={() => setI((i + 1) % n)} aria-label="Next review"><Icon name="chev" className="-rotate-90" /></button>}
      {n > 1 && <div className="mt-5 flex justify-center gap-2">{items.map((_, k) => <button key={k} onClick={() => setI(k)} aria-label={'Review ' + (k + 1)} className={'h-2.5 rounded-full transition-all ' + (k === i % n ? 'w-8 bg-brand' : 'w-2.5 bg-ink/20')} />)}</div>}
    </div>
  );
}
