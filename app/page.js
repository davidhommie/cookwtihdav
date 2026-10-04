import Link from 'next/link';
import ScrollSpy from '../components/ScrollSpy';
import HeroSlider from '../components/HeroSlider';
import Counters from '../components/Counters';
import Reveal from '../components/Reveal';
import Words from '../components/Words';
import Pic from '../components/Pic';
import Testimonials from '../components/Testimonials';
import { Icon, IconTile, Stars } from '../components/Icons';
import { getSettings, getMenu, getBranches } from '../lib/data';
import { money, mapSrc } from '../lib/utils';

export const revalidate = 60;

export default async function Home() {
  const [s, menu, branches] = await Promise.all([getSettings(), getMenu(), getBranches()]);
  const pop = menu.filter((m) => m.popular);
  const base = pop.length ? pop : menu;
  const featured = base.slice(0, 4);
  const slides = base.slice(0, 5).map((m) => ({ title: m.title, description: m.description, price: m.price, rating: m.rating, image: (m.images || [])[0] || '' }));
  const chips = menu.map((m) => (m.images || [])[0]).filter(Boolean).slice(0, 4);
  const pos = ['left-[2%] top-[17%]', 'right-[2%] top-[9%]', 'left-[4%] bottom-[9%]', 'right-[3%] bottom-[6%]'];
  const near = [...branches.filter((b) => b.featured), ...branches.filter((b) => !b.featured)].slice(0, 3);
  const tel = (p) => 'tel:' + String(p || '').replace(/[^+\d]/g, '');

  return (
    <>
      <ScrollSpy />
      <section id="hero" data-spy data-label="Top" className="relative overflow-hidden bg-gradient-to-b from-brand to-brand-dark pb-16 pt-36 text-white">
        {[0, 1, 2, 3].map((k) => (
          <span key={k} className={'absolute hidden h-20 w-20 overflow-hidden rounded-full bg-sun p-1.5 shadow-xl md:block ' + pos[k] + ' ' + (k % 2 ? 'float-slow' : 'float')} style={{ animationDelay: k * 0.7 + 's' }}>
            <Pic src={chips[k]} alt="" className="h-full w-full rounded-full" />
          </span>
        ))}
        <div className="relative mx-auto grid max-w-[1400px] items-center gap-10 px-4 lg:grid-cols-[1fr_1.15fr]">
          <div>
            <p className="rise mb-6 inline-block rounded-full bg-sun px-5 py-1.5 font-bold text-ink">{s.hero.badge}</p>
            <Words text={s.hero.headline} className="text-5xl font-black leading-[1.1] md:text-6xl" />
            <p className="rise mt-6 max-w-xl text-xl text-white/90" style={{ animationDelay: '.7s' }}>{s.hero.sub}</p>
            <div className="rise mt-8 flex flex-wrap gap-4" style={{ animationDelay: '.85s' }}>
              <Link href="/menu" className="btn-sun !px-8 !py-4 text-lg">{s.cta.primary}</Link>
              <Link href="/contact" className="btn-ghost !px-8 !py-4 text-lg">{s.cta.secondary}</Link>
            </div>
            <Counters className="mt-10 grid max-w-lg grid-cols-3 gap-6 border-t border-white/20 pt-6 text-left" items={[
              { value: s.stats.years, label: 'Years experience' }, { value: s.stats.staff, label: 'Staff members' }, { value: s.stats.locations, label: 'Locations' },
            ]} />
          </div>
          <HeroSlider slides={slides} />
        </div>
      </section>

      <section id="popular" data-spy data-label="Popular" className="mx-auto max-w-7xl px-4 py-20">
        <Reveal className="text-center">
          <h2 className="text-4xl font-bold md:text-5xl">{s.popular.title}</h2>
          <p className="mx-auto mt-3 max-w-xl text-lg text-ink/70">{s.popular.sub}</p>
        </Reveal>
        <div className="mt-10 grid grid-cols-2 gap-3 md:gap-6 lg:grid-cols-4">
          {featured.map((m, k) => (
            <Reveal key={m.id} delay={k * 90}>
              <Link href="/menu" className="block overflow-hidden rounded-2xl bg-white shadow transition hover:-translate-y-1 hover:shadow-lg">
                <Pic src={(m.images || [])[0]} alt={m.title} className="aspect-[4/3] w-full" />
                <div className="p-3 md:p-4">
                  <Stars rating={m.rating} />
                  <h3 className="mt-1 font-body text-lg font-black leading-snug">{m.title}</h3>
                  <p className="mt-2 text-lg font-black text-brand">{money(m.price)}</p>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
        <div className="mt-10 text-center"><Link href="/menu" className="btn-red text-lg">View full menu</Link></div>
      </section>

      <section id="why" data-spy data-label="Why us" className="bg-white py-20">
        <div className="mx-auto max-w-7xl px-4">
          <Reveal className="text-center">
            <h2 className="text-4xl font-bold md:text-5xl">{s.why.title}</h2>
            <p className="mx-auto mt-3 max-w-xl text-lg text-ink/70">{s.why.sub}</p>
          </Reveal>
          <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {s.why.items.map((w, k) => (
              <Reveal key={w.title} delay={k * 80}>
                <div className="h-full rounded-2xl bg-paper p-7 transition hover:-translate-y-1 hover:shadow-md">
                  <IconTile name={w.icon} />
                  <h3 className="mt-5 font-body text-xl font-black">{w.title}</h3>
                  <p className="mt-2 text-ink/70">{w.text}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section id="branches" data-spy data-label="Branches" className="bg-brand py-20 text-white">
        <div className="mx-auto max-w-7xl px-4">
          <Reveal className="text-center">
            <h2 className="text-4xl font-bold md:text-5xl">{s.branches_section.title}</h2>
            <p className="mx-auto mt-3 max-w-xl text-lg text-white/90">{s.branches_section.sub}</p>
          </Reveal>
          <div className="mt-10 flex flex-wrap justify-center gap-6">
            {near.map((b, k) => (
              <Reveal key={b.id} delay={k * 90} className="w-full md:w-[calc(50%-12px)] lg:w-[calc(33.333%-16px)]">
                <div className="overflow-hidden rounded-2xl bg-white text-ink shadow-xl">
                  <iframe title={'Map of ' + b.name} src={mapSrc(b)} className="h-52 w-full border-0" loading="lazy" referrerPolicy="no-referrer-when-downgrade" />
                  <div className="space-y-2 p-5">
                    <h3 className="font-body text-xl font-black">{b.name}</h3>
                    <p className="flex gap-2"><Icon name="pin" size={18} className="mt-1 shrink-0 text-brand" />{b.address}</p>
                    <p className="flex gap-2"><Icon name="clock" size={18} className="mt-1 shrink-0 text-brand" />{b.hours}</p>
                    <p className="flex gap-2"><Icon name="phone" size={18} className="mt-1 shrink-0 text-brand" /><a href={tel(b.phone)}>{b.phone}</a></p>
                    <a className="btn-red mt-2 w-full !py-2.5" href={'https://www.google.com/maps/dir/?api=1&destination=' + encodeURIComponent(b.address || b.name)} target="_blank" rel="noopener noreferrer">Get directions</a>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
          <div className="mt-10 text-center"><Link href="/branches" className="btn-sun text-lg">View all branches</Link></div>
        </div>
      </section>

      <section id="reviews" data-spy data-label="Reviews" className="px-4 py-20">
        <Reveal className="mb-12 text-center">
          <h2 className="text-4xl font-bold md:text-5xl">{s.testimonials.title}</h2>
          <p className="mx-auto mt-3 max-w-xl text-lg text-ink/70">{s.testimonials.sub}</p>
        </Reveal>
        <Testimonials items={s.testimonials.items || []} />
      </section>

      <section className="bg-sun py-16 text-center">
        <Reveal>
          <h2 className="text-4xl font-bold md:text-5xl">{s.cta_band.title}</h2>
          <p className="mt-2 text-lg text-ink/80">{s.cta_band.sub}</p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Link href="/menu" className="btn-red text-lg">{s.cta.primary}</Link>
            <Link href="/contact" className="btn border-2 border-ink text-lg text-ink hover:bg-ink hover:text-white">{s.cta.secondary}</Link>
          </div>
        </Reveal>
      </section>
    </>
  );
}
