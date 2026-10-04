import PageHero from '../../components/PageHero';
import ContactForm from '../../components/ContactForm';
import Policies from '../../components/Policies';
import Reveal from '../../components/Reveal';
import { IconTile } from '../../components/Icons';
import { getSettings } from '../../lib/data';
export const revalidate = 60;
export const metadata = { title: 'Contact | cookwithdavid' };

export default async function Contact() {
  const { contact: c, policies, faq } = await getSettings();
  const cards = [
    ['pin', 'Visit us', c.address], ['phone', 'Call us', c.phone], ['mail', 'Email us', c.email], ['clock', 'Opening hours', c.hours],
  ];
  return (
    <>
      <PageHero badge="Get in touch" title="Contact Us" sub="Questions, feedback or an event to plan? We would love to hear from you." />
      <section className="mx-auto grid max-w-6xl gap-5 px-4 py-14 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map(([ic, t, v], k) => (
          <Reveal key={t} delay={k * 80}>
            <div className="h-full rounded-2xl bg-white p-6 text-center shadow">
              <span className="mx-auto block w-fit"><IconTile name={ic} /></span>
              <h2 className="mt-3 font-body text-lg font-black">{t}</h2>
              <p className="mt-1 break-words text-ink/70">{v}</p>
            </div>
          </Reveal>
        ))}
      </section>
      <section className="mx-auto max-w-3xl px-4 pb-14"><ContactForm email={c.email} /></section>
      <section className="bg-white py-14">
        <div className="mx-auto max-w-3xl px-4">
          <h2 className="mb-6 text-center text-3xl font-bold">Frequently Asked Questions</h2>
          <Policies items={faq.map((f, i) => ({ id: 'faq' + i, title: f.q, body: f.a }))} />
        </div>
      </section>
      <section className="mx-auto max-w-3xl px-4 py-14">
        <h2 className="mb-6 text-center text-3xl font-bold">Policies</h2>
        <Policies items={policies} />
      </section>
    </>
  );
}
