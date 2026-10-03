import PageHero from '../../components/PageHero';
import Counters from '../../components/Counters';
import Reveal from '../../components/Reveal';
import Pic from '../../components/Pic';
import { Icon } from '../../components/Icons';
import { getSettings, getJourney, getTeam } from '../../lib/data';
export const revalidate = 60;
export const metadata = { title: 'About | cookwithdavid' };

export default async function About() {
  const [s, journey, team] = await Promise.all([getSettings(), getJourney(), getTeam()]);
  const a = s.about;
  return (
    <>
      <PageHero badge={a.badge} title={a.title} sub={a.sub} />
      <section className="mx-auto grid max-w-6xl gap-6 px-4 py-16 md:grid-cols-2">
        <Reveal><div className="h-full rounded-3xl bg-brand p-8 text-white"><h2 className="text-2xl font-bold">Our Mission</h2><p className="mt-3 text-white/90">{a.mission}</p></div></Reveal>
        <Reveal delay={100}><div className="h-full rounded-3xl bg-sun p-8 text-ink"><h2 className="text-2xl font-bold">Our Vision</h2><p className="mt-3">{a.vision}</p></div></Reveal>
      </section>

      <section className="bg-white py-16">
        <div className="mx-auto max-w-6xl px-4">
          <Reveal className="text-center"><h2 className="text-3xl font-bold">Our Core Values</h2></Reveal>
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {a.values.map((v, k) => (
              <Reveal key={v.title} delay={k * 80}>
                <div className="h-full rounded-2xl bg-paper p-6 text-center">
                  <span className="mx-auto grid h-12 w-12 place-items-center rounded-xl bg-brand/10 text-brand"><Icon name={v.icon} /></span>
                  <h3 className="mt-3 font-body font-black">{v.title}</h3>
                  <p className="mt-1 text-sm text-ink/70">{v.text}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-4 py-16">
        <Reveal className="text-center"><h2 className="text-3xl font-bold">Our Journey</h2></Reveal>
        <ol className="relative mt-10 border-l-4 border-brand/30 pl-8">
          {journey.map((j, k) => (
            <li key={j.id} className="relative pb-10 last:pb-0">
              <span className="absolute -left-[46px] top-1 h-5 w-5 rounded-full border-4 border-brand bg-white" />
              <Reveal delay={k * 80}>
                <p className="font-display font-bold text-brand">{j.year}</p>
                <h3 className="font-body text-lg font-black">{j.title}</h3>
                <p className="mt-1 text-ink/70">{j.body}</p>
              </Reveal>
            </li>
          ))}
        </ol>
      </section>

      <section className="bg-white py-16">
        <div className="mx-auto max-w-6xl px-4">
          <Reveal className="text-center"><h2 className="text-3xl font-bold">Meet Our Team</h2><p className="mt-2 text-ink/70">The people behind your favourite meals.</p></Reveal>
          {team.length === 0
            ? <p className="mt-8 text-center text-ink/50">Team members will appear here once they are added.</p>
            : <div className="mt-10 grid grid-cols-2 gap-5 md:grid-cols-4">
                {team.map((t, k) => (
                  <Reveal key={t.id} delay={k * 80}>
                    <div className="text-center">
                      <Pic src={t.image} alt={t.name} className="mx-auto aspect-square w-full rounded-full" />
                      <h3 className="mt-3 font-body font-black">{t.name}</h3>
                      <p className="text-sm text-ink/60">{t.role}</p>
                    </div>
                  </Reveal>
                ))}
              </div>}
        </div>
      </section>

      <section className="bg-brand py-14">
        <Counters items={[
          { value: s.stats.years, label: 'Years of service' }, { value: s.stats.locations, label: 'Branches' },
          { value: s.stats.customers, label: 'Happy customers' }, { value: s.stats.staff, label: 'Staff members' },
        ]} />
      </section>
    </>
  );
}
