import Words from './Words';
export default function PageHero({ badge, title, sub }) {
  return (
    <section className="bg-gradient-to-b from-brand to-brand-dark pb-20 pt-40 text-center text-white">
      <div className="mx-auto max-w-3xl px-4">
        <p className="rise mb-4 inline-block rounded-full bg-sun px-4 py-1 text-sm font-bold text-ink">{badge}</p>
        <Words text={title} className="text-4xl font-black md:text-5xl" />
        <p className="rise mx-auto mt-4 max-w-xl text-lg text-white/90" style={{ animationDelay: '.45s' }}>{sub}</p>
      </div>
    </section>
  );
}
