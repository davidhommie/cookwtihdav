import PageHero from '../../components/PageHero';
import MenuClient from '../../components/MenuClient';
import { getMenu } from '../../lib/data';
export const revalidate = 60;
export const metadata = { title: 'Menu | cookwithdavid' };
export default async function MenuPage() {
  const items = await getMenu();
  return (
    <>
      <PageHero badge="Explore our menu" title="Delicious Food Menu" sub="From Ghanaian favourites to fast food classics, cooked fresh and served with care." />
      <MenuClient items={items} />
    </>
  );
}
