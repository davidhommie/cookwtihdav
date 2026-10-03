import CheckoutClient from '../../components/CheckoutClient';
import { getSettings, getBranches } from '../../lib/data';
export const revalidate = 60;
export const metadata = { title: 'Checkout | cookwithdavid', robots: { index: false } };

export default async function Checkout() {
  const [s, branches] = await Promise.all([getSettings(), getBranches()]);
  return (
    <section className="bg-paper pb-16 pt-28">
      <div className="mx-auto max-w-6xl px-4">
        <h1 className="rise mb-8 text-3xl font-black md:text-4xl">Checkout</h1>
        <CheckoutClient payments={s.payments} branches={branches} />
      </div>
    </section>
  );
}
