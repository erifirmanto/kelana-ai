"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getTrips } from "@/services/tripService";
import TripCard from "@/components/TripCard";

interface Trip {
  id: number;
  destination: string;
  days: number;
  budget: number;
  category: string;
  travel_style: string;
  daily_budget: number;
}

export default function TripsPage() {
  const router = useRouter();

  const [trips, setTrips] = useState<Trip[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      router.push("/login");
      return;
    }

    async function loadTrips() {
      try {
        const data = await getTrips();
        setTrips(data);
      } catch (err: unknown) {
        setError(
          err instanceof Error
            ? err.message
            : "Failed to load trips"
        );
      } finally {
        setLoading(false);
      }
    }

    loadTrips();
  }, [router]);

  function handleLogout() {
    localStorage.removeItem("token");
    router.push("/login");
  }

  return (
    <main className="min-h-screen bg-[#eaf2fb] px-6 py-12">
      <div className="mx-auto max-w-4xl">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-[#1a6fbf]">
              Trip History
            </h1>

            <p className="mt-2 text-gray-500">
              Your saved travel itineraries
            </p>
          </div>

          <button
            onClick={handleLogout}
            className="rounded-full bg-gray-800 px-5 py-2 text-sm font-semibold text-white hover:bg-gray-700"
          >
            Logout
          </button>
        </div>

        {loading ? (
          <div className="mt-8 rounded-3xl bg-white p-10 text-center shadow-sm">
            <p className="text-gray-500">
              Loading trips...
            </p>
          </div>
        ) : error ? (
          <div className="mt-8 rounded-3xl bg-white p-10 text-center shadow-sm">
            <p className="text-red-500">
              {error}
            </p>
          </div>
        ) : trips.length === 0 ? (
          <div className="mt-8 rounded-3xl bg-white p-10 text-center shadow-sm">
            <div className="text-5xl">✈️</div>

            <h2 className="mt-4 text-xl font-bold text-gray-800">
              No trips found.
            </h2>

            <p className="mt-2 text-gray-500">
              Create your first itinerary.
            </p>

            <a
              href="/"
              className="mt-6 inline-block rounded-full bg-[#1a6fbf] px-6 py-3 font-semibold text-white hover:bg-[#155fa0]"
            >
              Generate a Trip →
            </a>
          </div>
        ) : (
          <div className="mt-8 flex flex-col gap-4">
            {trips.map((trip) => (
              <TripCard key={trip.id} trip={trip} />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}