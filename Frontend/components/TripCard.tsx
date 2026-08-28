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

interface TripCardProps {
  trip: Trip;
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

  return "🌍";
}

function getCategoryStyle(category: string) {
  switch (category.toLowerCase()) {
    case "backpacker":
      return "bg-green-100 text-green-700";
    case "standard":
      return "bg-blue-100 text-blue-700";
    case "luxury":
      return "bg-purple-100 text-purple-700";
    default:
      return "bg-gray-100 text-gray-700";
  }
}

function getTravelStyleStyle(travelStyle: string) {
  switch (travelStyle.toLowerCase()) {
    case "family":
      return "bg-orange-100 text-orange-700";
    case "solo":
      return "bg-cyan-100 text-cyan-700";
    case "couple":
      return "bg-pink-100 text-pink-700";
    default:
      return "bg-gray-100 text-gray-700";
  }
}

export default function TripCard({ trip }: TripCardProps) {
  return (
    <div className="rounded-3xl bg-white p-6 shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg">
      <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
        
        {/* Trip information */}
        <div className="flex items-start gap-4">
          
          {/* Destination code */}
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-[#eaf2fb] text-base font-extrabold tracking-wide text-[#1a6fbf]">
            {getDestinationCode(trip.destination)}
          </div>

          <div>
            {/* Destination */}
            <h2 className="text-xl font-bold text-gray-800">
              {trip.destination}
            </h2>

            {/* Duration and daily budget */}
            <p className="mt-1 text-sm text-gray-500">
              {trip.days} days · Daily budget USD{" "}
              {trip.daily_budget.toLocaleString("en-US")}
            </p>

            {/* Badges */}
            <div className="mt-3 flex flex-wrap gap-2">
              
              {/* Category badge */}
              <span
                className={`rounded-full px-3 py-1 text-xs font-semibold ${getCategoryStyle(
                  trip.category
                )}`}
              >
                {trip.category}
              </span>

              {/* Travel style badge */}
              <span
                className={`rounded-full px-3 py-1 text-xs font-semibold ${getTravelStyleStyle(
                  trip.travel_style
                )}`}
              >
                {trip.travel_style}
              </span>
            </div>

            {/* Total budget */}
            <p className="mt-3 text-base font-semibold text-gray-800">
              USD {trip.budget.toLocaleString("en-US")}
            </p>
          </div>
        </div>

        {/* View details button */}
        <Link
          href={`/trips/${trip.id}`}
          className="self-start rounded-full bg-[#1a6fbf] px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#155fa0] sm:self-center"
        >
          View Details →
        </Link>
      </div>
    </div>
  );
}