import { notFound } from "next/navigation";
import OfferDetailView from "@/components/offers/OfferDetailView";
import { allOffers, findOffer } from "@/data/offers";

export function generateStaticParams() {
  return allOffers.map(({ offer }) => ({ offerId: offer.number }));
}

export default async function OfferPage(props: PageProps<"/offers/[offerId]">) {
  const { offerId } = await props.params;
  const match = findOffer(offerId);
  if (!match) notFound();
  return <OfferDetailView property={match.property} offer={match.offer} />;
}
