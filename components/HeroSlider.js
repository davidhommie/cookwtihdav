'use client';
import { useEffect, useState } from 'react';
import Pic from './Pic';
import { money } from '../lib/utils';

// Floating circle; each dish slides in with its own price badge.
export default function HeroSlider({ slides }) {
  const [i, setI] = useState(0);
  useEffect(() => {
    if (slides.length < 2) return;
    const t = setInterval(() => setI((x) => (x + 1) % slides.length), 3500);
    return () => clearInterval(t);
  }, [slides.length]);
  const cur = slides[i];
  if (!cur) return null;
  return (
    <div className="float-slow relative mx-auto aspect-square w-[min(80vw,430px)]">
      <div className="absolute inset-0 rounded-full border-[10px] border-white/25" />
      <div className="absolute inset-3 overflow-hidden rounded-full bg-white/10 ring-4 ring-sun/70">
        {slides.map((s, k) => (
          <div key={k} className={'absolute inset-0 transition-all duration-700 ' + (k === i ? 'translate-x-0 opacity-100' : 'translate-x-16 opacity-0')}>
            <Pic src={s.image} alt={s.title} className="h-full w-full" />
          </div>
        ))}
      </div>
      <div key={'p' + i} className="rise absolute -right-2 top-10 rounded-2xl bg-sun px-4 py-2 text-ink shadow-lg">
        <span className="block text-xs font-bold">Starting from</span>
        <span className="font-display text-xl font-black">{money(cur.price)}</span>
      </div>
      <div key={'t' + i} className="rise absolute inset-x-8 bottom-8 rounded-xl bg-ink/70 px-3 py-2 text-center text-sm font-bold text-white">{cur.title}</div>
    </div>
  );
}
