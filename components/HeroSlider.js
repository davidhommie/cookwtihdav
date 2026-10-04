'use client';
import { useEffect, useState } from 'react';
import Pic from './Pic';
import { Icon } from './Icons';
import { money } from '../lib/utils';

// Large floating circle. Dish name, description and rating sit inside the photo; each dish has its own price badge.
export default function HeroSlider({ slides }) {
  const [i, setI] = useState(0);
  useEffect(() => {
    if (slides.length < 2) return;
    const t = setInterval(() => setI((x) => (x + 1) % slides.length), 4000);
    return () => clearInterval(t);
  }, [slides.length]);
  const cur = slides[i];
  if (!cur) return null;
  return (
    <div className="float-slow relative mx-auto aspect-square w-[min(94vw,660px)]">
      <div className="absolute inset-0 rounded-full bg-white/10" />
      <div className="absolute inset-4 overflow-hidden rounded-full bg-brand-dark ring-8 ring-sun/70">
        {slides.map((s, k) => (
          <div key={k} className={'absolute inset-0 transition-all duration-700 ' + (k === i ? 'translate-x-0 opacity-100' : 'translate-x-20 opacity-0')}>
            <Pic src={s.image} alt={s.title} className="h-full w-full" />
          </div>
        ))}
        <div key={'t' + i} className="rise absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 via-black/55 to-transparent px-12 pb-14 pt-28 text-center text-white">
          <h3 className="font-body text-2xl font-black leading-tight md:text-3xl">{cur.title}</h3>
          {cur.description && <p className="mx-auto mt-1 line-clamp-1 max-w-sm text-white/85">{cur.description}</p>}
          <div className="mt-2 flex items-center justify-center gap-2">
            <span className="flex text-sun">{[0, 1, 2, 3, 4].map((n) => <Icon key={n} name="star" size={18} fill={n < Math.round(cur.rating || 5)} />)}</span>
            <span className="font-bold">{Number(cur.rating || 5).toFixed(1)}</span>
          </div>
        </div>
      </div>
      <div key={'p' + i} className="rise absolute right-0 top-16 rounded-2xl bg-sun px-5 py-3 text-ink shadow-xl">
        <span className="block text-sm font-bold">Starting from</span>
        <span className="font-display text-2xl font-black">{money(cur.price)}</span>
      </div>
    </div>
  );
}
