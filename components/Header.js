'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useCart } from './Providers';
import { safeHref } from '../lib/utils';

const Phone = () => (<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 1.9.7 2.8a2 2 0 0 1-.5 2.1L8 9.9a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.8.7a2 2 0 0 1 1.7 2z" /></svg>);
const Cart = () => (<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="9" cy="21" r="1" /><circle cx="20" cy="21" r="1" /><path d="M1 1h4l2.7 13.4a2 2 0 0 0 2 1.6h9.7a2 2 0 0 0 2-1.6L23 6H6" /></svg>);

export default function Header({ settings }) {
  const { brand, contact, nav, cta } = settings;
  const [solid, setSolid] = useState(false); // false = red header, true = white header
  const [open, setOpen] = useState(false);
  const path = usePathname();
  const { count } = useCart();

  useEffect(() => {
    const on = () => setSolid(window.scrollY > 40);
    on();
    window.addEventListener('scroll', on, { passive: true });
    return () => window.removeEventListener('scroll', on);
  }, []);
  useEffect(() => setOpen(false), [path]);

  const tone = solid ? 'bg-white text-ink shadow-md' : 'bg-brand text-white';
  const link = (href) =>
    'border-b-2 py-1 text-sm font-bold transition-colors ' +
    (path === href ? (solid ? 'border-brand text-brand' : 'border-sun') : 'border-transparent ' + (solid ? 'hover:text-brand' : 'hover:text-sun'));

  return (
    <header className={'fixed inset-x-0 top-0 z-50 transition-colors duration-300 ' + tone}>
      <div className="mx-auto flex h-[72px] max-w-7xl items-center justify-between gap-4 px-4">
        <Link href="/" className="flex items-center" aria-label={brand.name}>
          {brand.logo_url
            ? <img src={brand.logo_url} alt={brand.name} className={'h-10 w-auto ' + (solid ? '' : 'logo-white')} />
            : <span className="font-display text-xl font-bold tracking-wide">{brand.name}</span>}
        </Link>

        <nav className="hidden items-center gap-7 lg:flex" aria-label="Main">
          {nav.map((n) => <Link key={n.label} href={safeHref(n.href)} className={link(n.href)}>{n.label}</Link>)}
        </nav>

        <div className="flex items-center gap-3">
          <a href={'tel:' + String(contact.phone).replace(/[^+\d]/g, '')} className="hidden items-center gap-2 text-sm font-bold xl:flex">
            <Phone /> {contact.phone}
          </a>
          <Link href="/checkout" className="relative p-2" aria-label={'Cart, ' + count + ' items'}>
            <Cart />
            {count > 0 && <span className="absolute -right-0.5 -top-0.5 grid h-5 min-w-5 place-items-center rounded-full bg-sun px-1 text-[11px] font-black text-ink">{count}</span>}
          </Link>
          <Link href="/menu" className={(solid ? 'btn-red' : 'btn-sun') + ' hidden !px-5 !py-2 text-sm sm:inline-flex'}>{cta.primary}</Link>
          <button className="p-2 lg:hidden" onClick={() => setOpen(!open)} aria-label="Menu" aria-expanded={open}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d={open ? 'M6 6l12 12M18 6L6 18' : 'M4 7h16M4 12h16M4 17h16'} /></svg>
          </button>
        </div>
      </div>

      {open && (
        <nav className={'flex flex-col gap-1 px-4 pb-4 lg:hidden ' + tone} aria-label="Mobile">
          {nav.map((n) => <Link key={n.label} href={safeHref(n.href)} className="rounded-lg py-3 text-base font-bold">{n.label}</Link>)}
          <Link href="/menu" className={(solid ? 'btn-red' : 'btn-sun') + ' mt-2'}>{cta.primary}</Link>
        </nav>
      )}
    </header>
  );
}
