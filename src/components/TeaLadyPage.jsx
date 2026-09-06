import MakerPage from './MakerPage';
import { teas } from '../data/coffees';

export default function TeaLadyPage() {
  return (
    <MakerPage
      category="tea"
      title="Tea Lady"
      icon="🫖"
      accentPill="bg-teal-600"
      accentSpinner="border-t-teal-600"
      makingTitle="Steeping"
      emptyArt={teas[0].svg}
      emptyTitle="Waiting for the first tea"
      emptyBody="Tea orders land here the moment they're placed."
    />
  );
}