import Link from 'next/link';
import { Icon, Brand } from './Icons';
import { safeHref, waLink } from '../lib/utils';

export default function Footer({ settings }) {
  const { brand, contact, footer, nav, policies, social, whatsapp } = settings;
  const h = 'mb-4 font-display text-xl font-bold text-white';
  const a = 'block py-1 text-white/70 transition hover:text-sun';
  const socials = [
    ['facebook', 'Facebook', social.facebook || 'https://www.facebook.com/'],
    ['instagram', 'Instagram', social.instagram || 'https://www.instagram.com/'],
    ['tiktok', 'TikTok', social.tiktok || 'https://www.tiktok.com/'],
    ['whatsapp', 'WhatsApp', waLink(whatsapp.number || contact.phone, '')],
  ];
  return (
    <footer className="bg-ink text-white">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 md:grid-cols-4">
        <div>
          {brand.logo_url
            ? <img src={brand.logo_url} alt={brand.name} className="logo-white h-14 w-auto" />
            : <p className="font-display text-3xl font-bold">{brand.name}</p>}
          <p className="mt-3 text-white/70">{footer.about}</p>
          <div className="mt-5 flex gap-3">
            {socials.map(([n, l, href]) => (
              <a key={n} href={safeHref(href)} target="_blank" rel="noopener noreferrer" aria-label={l} className="grid h-11 w-11 place-items-center rounded-xl bg-white/10 transition hover:-translate-y-0.5 hover:bg-brand"><Brand name={n} size={20} /></a>
            ))}
          </div>
        </div>
        <div>
          <p className={h}>Quick links</p>
          {nav.map((n) => <Link key={n.label} href={safeHref(n.href)} className={a}>{n.label}</Link>)}
        </div>
        <div>
          <p className={h}>Policies</p>
          {policies.map((p) => <Link key={p.id} href={'/contact#' + p.id} className={a}>{p.title}</Link>)}
        </div>
        <div className="space-y-3 text-white/70">
          <p className={h}>Contact us</p>
          <p className="flex gap-3"><Icon name="pin" className="mt-1 shrink-0 text-sun" />{contact.address}</p>
          <a href={'tel:' + String(contact.phone).replace(/[^+\d]/g, '')} className="flex gap-3 hover:text-sun"><Icon name="phone" className="shrink-0 text-sun" />{contact.phone}</a>
          <a href={'mailto:' + contact.email} className="flex gap-3 hover:text-sun"><Icon name="mail" className="shrink-0 text-sun" />{contact.email}</a>
          <p className="flex gap-3"><Icon name="clock" className="shrink-0 text-sun" />{contact.hours}</p>
        </div>
      </div>
      <div className="border-t border-white/10 py-5 pr-24 text-center text-sm text-white/50">
        &copy; {new Date().getFullYear()} {brand.name}. All rights reserved. {footer.credit}
      </div>
    </footer>
  );
}
