'use client';
import { useEffect, useRef } from 'react';
// items: [{ value, label }]. Numbers count up with CSS counters when scrolled into view.
export default function Counters({ items }) {
  const r = useRef(null);
  useEffect(() => {
    const el = r.current;
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { el.querySelectorAll('.counter').forEach((c) => c.classList.add('go')); io.disconnect(); }
    }, { threshold: 0.3 });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return (
    <div ref={r} className="mx-auto grid max-w-5xl grid-cols-2 gap-8 px-4 text-center md:grid-cols-4">
      {items.map((it) => (
        <div key={it.label}>
          <div className="counter font-display text-4xl font-black text-sun md:text-5xl" style={{ '--to': Number(it.value) || 0 }} data-suffix="+" aria-label={it.value + '+'} />
          <p className="mt-1 font-bold text-white/90">{it.label}</p>
        </div>
      ))}
    </div>
  );
}
