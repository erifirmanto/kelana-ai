import Link from "next/link";

interface Trip {
  id: number;
  destination: string;
  days: number;
  budget: number;
  category: string;
  travel_style: string;
  daily_budget: number;
}

function getDestinationCode(destination: string) {
  const name = destination.toLowerCase();
  if (name.includes("japan")) return "JP";
  if (name.includes("malaysia")) return "MY";
  if (name.includes("indonesia")) return "ID";
  if (name.includes("singapore")) return "SG";
  if (name.includes("thailand")) return "TH";
  if (name.includes("korea")) return "KR";
  if (name.includes("china")) return "CN";
  if (name.includes("france")) return "FR";
  if (name.includes("italy")) return "IT";
  if (name.includes("usa")) return "US";
  if (name.includes("brunei")) return "BN";
  return "✈";
}

export default function TripCard({ trip }: { trip: Trip }) {
  return (
    <article className="kelana-trip-card">
      <div className="kelana-trip-art">
        <div className="kelana-trip-art-glow" />
        <span>{getDestinationCode(trip.destination)}</span>
      </div>

      <div className="kelana-trip-content">
        <div className="kelana-trip-topline">
          <span>{trip.days} days</span>
          <span>•</span>
          <span>{trip.travel_style}</span>
        </div>

        <h2>{trip.destination}</h2>

        <p>
          A {trip.category.toLowerCase()} journey with a daily budget of{" "}
          <strong>USD {trip.daily_budget.toLocaleString("en-US")}</strong>.
        </p>

        <div className="kelana-trip-bottom">
          <strong>USD {trip.budget.toLocaleString("en-US")}</strong>
          <Link href={`/trips/${trip.id}`}>
            View journey <span>→</span>
          </Link>
        </div>
      </div>
    </article>
  );
}
