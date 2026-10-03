'use client';
import { useState } from 'react';
import Link from 'next/link';
import { Icon } from './Icons';

const GMAPS = /^https:\/\/www\.google\.com\/maps\/embed/;
// Each branch has its own map: a pasted Google embed link, or one built from the address.
const mapSrc = (b) => (GMAPS.test(b.map_embed || '') ? b.map_embed : 'https://www.google.com/maps?q=' + encodeURIComponent(b.address || b.name) + '&output=embed');

export default function BranchesClient({ branches }) {
  const [id, setId] = useState(branches[0]?.id);
  const b = branches.find((x) => x.id === id) || branches[0];
  if (!b) return null;
  const dest = encodeURIComponent(b.address || b.name);
  return (
    <section className="mx-auto grid max-w-7xl gap-8 px-4 py-14 lg:grid-cols-[360px_1fr]">
      <div>
        <h2 className="mb-4 text-2xl font-bold">All Locations</h2>
        <div className="space-y-3">
          {branches.map((x) => (
            <button key={x.id} onClick={() => setId(x.id)} className={'flex w-full items-center gap-3 rounded-2xl border-2 bg-white p-4 text-left transition ' + (x.id === b.id ? 'border-brand shadow' : 'border-transparent hover:border-brand/40')}>
              <span className={'grid h-10 w-10 shrink-0 place-items-center rounded-full ' + (x.id === b.id ? 'bg-brand text-white' : 'bg-brand/10 text-brand')}><Icon name="pin" size={18} /></span>
              <span><span className="block font-black">{x.name}</span><span className="block text-sm text-ink/60">{x.address}</span></span>
              {x.featured && <span className="ml-auto rounded-full bg-sun px-2 py-0.5 text-xs font-bold">Featured</span>}
            </button>
          ))}
        </div>
      </div>
      <div key={b.id} className="rise">
        <iframe title={'Map of ' + b.name} src={mapSrc(b)} className="h-80 w-full rounded-3xl border-0 shadow md:h-96" loading="lazy" referrerPolicy="no-referrer-when-downgrade" />
        <div className="mt-5 rounded-3xl bg-white p-6 shadow">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h3 className="text-2xl font-bold">{b.name}</h3>
            <a className="btn-red !py-2 text-sm" href={'https://www.google.com/maps/dir/?api=1&destination=' + dest} target="_blank" rel="noopener noreferrer">Get directions</a>
          </div>
          <div className="mt-5 grid gap-4 sm:grid-cols-3">
            <p className="flex gap-3"><Icon name="pin" className="mt-1 shrink-0 text-brand" /><span><span className="block text-sm text-ink/50">Address</span>{b.address}</span></p>
            <p className="flex gap-3"><Icon name="clock" className="mt-1 shrink-0 text-brand" /><span><span className="block text-sm text-ink/50">Opening hours</span>{b.hours}</span></p>
            <p className="flex gap-3"><Icon name="phone" className="mt-1 shrink-0 text-brand" /><span><span className="block text-sm text-ink/50">Phone</span><a className="font-bold text-brand" href={'tel:' + String(b.phone || '').replace(/[^+\d]/g, '')}>{b.phone}</a></span></p>
          </div>
          <div className="mt-6 flex flex-wrap gap-3 border-t border-ink/10 pt-5">
            <a className="btn border-2 border-brand !py-2 text-sm text-brand hover:bg-brand hover:text-white" href={'tel:' + String(b.phone || '').replace(/[^+\d]/g, '')}>Call branch</a>
            <a className="btn border-2 border-brand !py-2 text-sm text-brand hover:bg-brand hover:text-white" href={'https://www.google.com/maps/search/?api=1&query=' + dest} target="_blank" rel="noopener noreferrer">View on Google Maps</a>
          </div>
        </div>
      </div>
      <div className="rounded-3xl bg-brand p-10 text-center text-white lg:col-span-2">
        <h2 className="text-3xl font-bold">Cannot visit? We will come to you</h2>
        <p className="mt-2 text-white/90">Order online and get your meal delivered to your door.</p>
        <Link href="/menu" className="btn-sun mt-6">Order delivery now</Link>
      </div>
    </section>
  );
}
