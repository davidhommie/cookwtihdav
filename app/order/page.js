import { Suspense } from 'react';
import OrderClient from '../../components/OrderClient';
import { getSettings } from '../../lib/data';
export const metadata = { title: 'Your order | cookwithdavid', robots: { index: false } };

export default async function OrderPage() {
  const s = await getSettings();
  return (
    <section className="bg-paper pb-16 pt-36">
      <div className="mx-auto max-w-2xl px-4">
        <Suspense fallback={<p className="text-center text-ink/60">Loading your order...</p>}>
          <OrderClient instructions={s.payments.manual.instructions} phone={s.contact.phone} />
        </Suspense>
      </div>
    </section>
  );
}
