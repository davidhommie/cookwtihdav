import PageHero from '../../components/PageHero';
import BranchesClient from '../../components/BranchesClient';
import { getBranches } from '../../lib/data';
export const revalidate = 60;
export const metadata = { title: 'Branches | cookwithdavid' };
export default async function Branches() {
  const branches = await getBranches();
  return (
    <>
      <PageHero badge="Find us" title="Our Branches" sub="Visit a branch near you, or order online and we will bring the food to you." />
      <BranchesClient branches={branches} />
    </>
  );
}
