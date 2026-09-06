"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
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
    if (!localStorage.getItem("token")) {
      router.push("/login");
      return;
    }

    async function loadTrips() {
      try {
        setTrips(await getTrips());
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : "Failed to load trips");
      } finally {
        setLoading(false);
      }
    }

    loadTrips();
  }, [router]);

  return (
    <main className="kelana-page kelana-trips">
      <div className="kelana-page-heading">
        <div>
          <span className="kelana-eyebrow">YOUR ADVENTURES</span>
          <h1>My Journeys</h1>
          <p>The places you&apos;ve dreamed about, planned and saved.</p>
        </div>

        <Link href="/" className="kelana-button primary">
          + Plan a trip
        </Link>
      </div>

      {loading ? (
        <div className="kelana-state-card">
          <div className="kelana-loader" />
          <h2>Gathering your journeys...</h2>
          <p>Just a moment.</p>
        </div>
      ) : error ? (
        <div className="kelana-state-card error">
          <div className="kelana-state-icon">!</div>
          <h2>We couldn&apos;t load your journeys.</h2>
          <p>{error}</p>
        </div>
      ) : trips.length === 0 ? (
        <div className="kelana-empty-trips">
          <div className="kelana-empty-illustration">✈</div>
          <span className="kelana-eyebrow">NOTHING HERE YET</span>
          <h2>Your next adventure is waiting.</h2>
          <p>
            Give KelanaAI a destination, a budget and a few days. We&apos;ll
            take care of the rest.
          </p>
          <Link href="/" className="kelana-button primary">
            Create my first journey →
          </Link>
        </div>
      ) : (
        <div className="kelana-trip-grid">
          {trips.map((trip) => (
            <TripCard key={trip.id} trip={trip} />
          ))}
        </div>
      )}
    </main>
  );
}
