'use client';
import { useEffect, useState } from 'react';
import { Icon } from './Icons';
// Expandable sections. A link like /contact#refund opens the matching one.
export default function Policies({ items }) {
  const [open, setOpen] = useState('');
  useEffect(() => {
    const go = () => {
      const h = decodeURIComponent(window.location.hash.slice(1));
      if (items.some((i) => i.id === h)) { setOpen(h); setTimeout(() => document.getElementById(h)?.scrollIntoView({ behavior: 'smooth', block: 'center' }), 50); }
    };
    go();
    window.addEventListener('hashchange', go);
    return () => window.removeEventListener('hashchange', go);
  }, [items]);
  return (
    <div className="space-y-3">
      {items.map((p) => (
        <details key={p.id} id={p.id} open={open === p.id} onToggle={(e) => setOpen(e.currentTarget.open ? p.id : (o) => o)} className="scroll-mt-28 rounded-2xl bg-paper p-5">
          <summary className="flex items-center justify-between gap-3 font-black">{p.title}<Icon name="chev" className="chev shrink-0 text-brand transition" /></summary>
          <p className="mt-3 whitespace-pre-line text-ink/70">{p.body}</p>
        </details>
      ))}
    </div>
  );
}
