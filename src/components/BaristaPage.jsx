import MakerPage from './MakerPage';
import { coffees } from '../data/coffees';

export default function BaristaPage() {
  return (
    <MakerPage
      category="coffee"
      title="Barista"
      icon="☕"
      accentPill="bg-emerald-500"
      accentSpinner="border-t-emerald-600"
      makingTitle="On the machine"
      emptyArt={coffees[0].svg}
      emptyTitle="Waiting for the first order"
      emptyBody="Tell everyone the address below - or point them at the QR code."
    />
  );
}