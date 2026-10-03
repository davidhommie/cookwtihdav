import Link from 'next/link';
import ScrollSpy from '../components/ScrollSpy';
import HeroSlider from '../components/HeroSlider';
import Counters from '../components/Counters';
import Reveal from '../components/Reveal';
import Words from '../components/Words';
import Pic from '../components/Pic';
import { Icon, Stars } from '../components/Icons';
import { getSettings, getMenu } from '../lib/data';
import { money } from '../lib/utils';

export const revalidate = 60;

export default async function Home() {
  const [s, menu] = await Promise.all([getSettings(), getMenu()]);
  const pop = menu.filter((m) => m.popular);
  const featured = (pop.length ? pop : menu).slice(0, 4);
  const slides = (pop.length ? pop : menu).slice(0, 5).map((m) => ({ title: m.title, price: m.price, image: (m.images || [])[0] || '' }));
  const widgets = [['plate', 'left-[4%] top-[18%]', 'float'], ['leaf', 'right-[6%] top-[12%]', 'float-slow'], ['heart', 'left-[46%] bottom-[8%]', 'float']];

  return (
    <>
      <ScrollSpy />
      <section id="hero" data-spy data-label="Top" className="relative overflow-hidden bg-gradient-to-b from-brand to-brand-dark pb-20 pt-32 text-white">
        {widgets.map(([n, pos, anim], k) => (
          <span key={n} className={'absolute hidden h-12 w-12 place-items-center rounded-full bg-sun text-ink shadow-lg md:grid ' + pos + ' ' + anim} style={{ animationDelay: k * 0.8 + 's' }}><Icon name={n} /></span>
        ))}
        <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-4 lg:grid-cols-2">
          <div>
            <p className="rise mb-5 inline-block rounded-full bg-sun px-4 py-1 text-sm font-bold text-ink">{s.hero.badge}</p>
            <Words text={s.hero.headline} className="text-4xl font-black leading-tight md:text-6xl" />
            <p className="rise mt-5 max-w-lg text-lg text-white/90" style={{ animationDelay: '.7s' }}>{s.hero.sub}</p>
            <div className="rise mt-8 flex flex-wrap gap-3" style={{ animationDelay: '.85s' }}>
              <Link href="/menu" className="btn-sun">{s.cta.primary}</Link>
              <Link href="/contact" className="btn-ghost">{s.cta.secondary}</Link>
            </div>
          </div>
          <HeroSlider slides={slides} />
        </div>
      </section>

      <section id="stats" data-spy data-label="Numbers" className="bg-brand-dark py-12">
        <Counters items={[
          { value: s.stats.years, label: 'Years of experience' }, { value: s.stats.staff, label: 'Staff members' },
          { value: s.stats.locations, label: 'Locations' }, { value: s.stats.customers, label: 'Happy customers' },
        ]} />
      </section>

      <section id="popular" data-spy data-label="Popular" className="mx-auto max-w-7xl px-4 py-20">
        <Reveal className="text-center">
          <h2 className="text-3xl font-bold md:text-4xl">{s.popular.title}</h2>
          <p className="mx-auto mt-3 max-w-xl text-ink/70">{s.popular.sub}</p>
        </Reveal>
        <div className="mt-10 grid grid-cols-2 gap-3 md:gap-6 lg:grid-cols-4">
          {featured.map((m, k) => (
            <Reveal key={m.id} delay={k * 90}>
              <Link href="/menu" className="block overflow-hidden rounded-2xl bg-white shadow transition hover:-translate-y-1 hover:shadow-lg">
                <Pic src={(m.images || [])[0]} alt={m.title} className="aspect-[4/3] w-full" />
                <div className="p-3 md:p-4">
                  <Stars rating={m.rating} />
                  <h3 className="mt-1 font-body text-base font-black leading-snug">{m.title}</h3>
                  <p className="mt-2 font-black text-brand">{money(m.price)}</p>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
        <div className="mt-10 text-center"><Link href="/menu" className="btn-red">View full menu</Link></div>
      </section>

      <section id="why" data-spy data-label="Why us" className="bg-white py-20">
        <div className="mx-auto max-w-7xl px-4">
          <Reveal className="text-center">
            <h2 className="text-3xl font-bold md:text-4xl">{s.why.title}</h2>
            <p className="mx-auto mt-3 max-w-xl text-ink/70">{s.why.sub}</p>
          </Reveal>
          <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {s.why.items.map((w, k) => (
              <Reveal key={w.title} delay={k * 80}>
                <div className="h-full rounded-2xl bg-paper p-6">
                  <span className="grid h-12 w-12 place-items-center rounded-xl bg-brand text-white"><Icon name={w.icon} /></span>
                  <h3 className="mt-4 font-body text-lg font-black">{w.title}</h3>
                  <p className="mt-1 text-ink/70">{w.text}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-sun py-16 text-center">
        <Reveal>
          <h2 className="text-3xl font-bold md:text-4xl">{s.cta_band.title}</h2>
          <p className="mt-2 text-ink/80">{s.cta_band.sub}</p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Link href="/menu" className="btn-red">{s.cta.primary}</Link>
            <Link href="/contact" className="btn border-2 border-ink text-ink hover:bg-ink hover:text-white">{s.cta.secondary}</Link>
          </div>
        </Reveal>
      </section>
    </>
  );
}
