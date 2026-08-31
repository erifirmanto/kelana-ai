"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { getTrip } from "@/services/tripService";

interface Trip {
  id: number;
  destination: string;
  days: number;
  budget: number;
  category: string;
  travel_style: string;
  daily_budget: number;
  ai_recommendation: string;
  created_at: string;
}

export default function TripDetailPage() {
  const router = useRouter();
  const params = useParams();

  const [trip, setTrip] = useState<Trip | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      router.push("/login");
      return;
    }

    async function loadTrip() {
      try {
        const data = await getTrip(Number(params.id));
        setTrip(data);
      } catch (err: unknown) {
        setError(
          err instanceof Error
            ? err.message
            : "Failed to load trip"
        );
      } finally {
        setLoading(false);
      }
    }

    loadTrip();
  }, [params.id, router]);

  if (loading) {
    return (
      <main className="min-h-screen bg-[#eaf2fb] px-6 py-12">
        <div className="mx-auto max-w-4xl">
          <div className="rounded-3xl bg-white p-10 text-center shadow-sm">
            <p className="text-gray-500">
              Loading trip...
            </p>
          </div>
        </div>
      </main>
    );
  }

  if (error || !trip) {
    return (
      <main className="min-h-screen bg-[#eaf2fb] px-6 py-12">
        <div className="mx-auto max-w-4xl">
          <Link
            href="/trips"
            className="text-sm font-semibold text-[#1a6fbf] hover:underline"
          >
            ← Back to Trip History
          </Link>

          <div className="mt-6 rounded-3xl bg-white p-10 text-center shadow-sm">
            <p className="text-red-500">
              {error || "Trip not found"}
            </p>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#eaf2fb] px-6 py-12">
      <div className="mx-auto max-w-4xl">

        <Link
          href="/trips"
          className="text-sm font-semibold text-[#1a6fbf] hover:underline"
        >
          ← Back to Trip History
        </Link>

        <div className="mt-6 rounded-3xl bg-white p-8 shadow-sm">

          <h1 className="text-3xl font-bold text-[#1a6fbf]">
            {trip.destination}
          </h1>

          <p className="mt-2 text-gray-500">
            Your AI-generated travel itinerary
          </p>

          <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2">

            <div className="rounded-2xl bg-[#eaf2fb] p-5">
              <p className="text-sm text-gray-500">
                Duration
              </p>

              <p className="mt-1 text-xl font-bold text-gray-800">
                {trip.days} days
              </p>
            </div>

            <div className="rounded-2xl bg-[#eaf2fb] p-5">
              <p className="text-sm text-gray-500">
                Budget
              </p>

              <p className="mt-1 text-xl font-bold text-gray-800">
                USD {trip.budget}
              </p>
            </div>

            <div className="rounded-2xl bg-[#eaf2fb] p-5">
              <p className="text-sm text-gray-500">
                Category
              </p>

              <p className="mt-1 text-xl font-bold text-gray-800">
                {trip.category}
              </p>
            </div>

            <div className="rounded-2xl bg-[#eaf2fb] p-5">
              <p className="text-sm text-gray-500">
                Daily Budget
              </p>

              <p className="mt-1 text-xl font-bold text-gray-800">
                USD {trip.daily_budget}
              </p>
            </div>

          </div>

          <div className="mt-8 border-t border-gray-100 pt-8">

            <h2 className="text-2xl font-bold text-gray-800">
              AI Recommendation
            </h2>

            <div className="mt-5 whitespace-pre-wrap leading-relaxed text-gray-700">
              {trip.ai_recommendation}
            </div>

          </div>

        </div>
      </div>
    </main>
  );
}