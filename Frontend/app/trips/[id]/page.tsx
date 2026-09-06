"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { getTrip } from "@/services/tripService";
import { getDestinationHero } from "@/lib/destinationHero";

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

type Activity = {
  title: string;
  description: string;
};

type DaySection = {
  day: number;
  title: string;
  periods: {
    name: string;
    activities: Activity[];
  }[];
};

function cleanInline(text: string) {
  return text
    .replace(/\*\*(.*?)\*\*/g, "$1")
    .replace(/__(.*?)__/g, "$1")
    .replace(/`(.*?)`/g, "$1")
    .trim();
}

function parseItinerary(text: string, fallbackDays: number): DaySection[] {
  const lines = text
    .replace(/\r/g, "")
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);

  const days: DaySection[] = [];
  let currentDay: DaySection | null = null;
  let currentPeriod: DaySection["periods"][number] | null = null;

  for (const rawLine of lines) {
    const line = rawLine.replace(/^[-•]\s*/, "").trim();

    const dayMatch = line.match(/^#{1,4}\s*Day\s+(\d+)\s*:?\s*(.*)$/i);

    if (dayMatch) {
      currentDay = {
        day: Number(dayMatch[1]),
        title: cleanInline(dayMatch[2]) || "Your day",
        periods: [],
      };
      days.push(currentDay);
      currentPeriod = null;
      continue;
    }

    const periodMatch = line.match(
      /^\*{0,2}(Morning|Afternoon|Evening|Night|Late Morning|Late Afternoon)\s*(?:Activities?)?\s*:?\s*\*{0,2}$/i
    );

    if (periodMatch && currentDay) {
      currentPeriod = {
        name:
          periodMatch[1].charAt(0).toUpperCase() +
          periodMatch[1].slice(1).toLowerCase(),
        activities: [],
      };
      currentDay.periods.push(currentPeriod);
      continue;
    }

    const numberedMatch = line.match(/^\d+\.\s*(.*)$/);

    if (numberedMatch && currentDay) {
      const content = numberedMatch[1].trim();
      const boldTitle = content.match(/^\*\*(.*?)\*\*\s*(?:[-–—:]\s*)?(.*)$/);

      const activity: Activity = boldTitle
        ? {
            title: cleanInline(boldTitle[1]),
            description: cleanInline(boldTitle[2]),
          }
        : {
            title: cleanInline(content),
            description: "",
          };

      if (!currentPeriod) {
        currentPeriod = {
          name: "Highlights",
          activities: [],
        };
        currentDay.periods.push(currentPeriod);
      }

      currentPeriod.activities.push(activity);
      continue;
    }

    // Some model outputs use plain lines rather than numbered activities.
    // Preserve them as a description under the current period.
    if (currentDay && currentPeriod && currentPeriod.activities.length > 0) {
      const last = currentPeriod.activities[currentPeriod.activities.length - 1];
      if (!last.description) {
        last.description = cleanInline(line);
      }
    }
  }

  // If an older/irregular recommendation doesn't contain Day headings,
  // still show the full content rather than losing data.
  if (days.length === 0 && text.trim()) {
    return [
      {
        day: 1,
        title: "Your itinerary",
        periods: [
          {
            name: "AI recommendation",
            activities: [
              {
                title: "KelanaAI's recommendation",
                description: cleanInline(text),
              },
            ],
          },
        ],
      },
    ];
  }

  // Keep the UI useful even when the model returned fewer explicit days.
  if (days.length === 0 && fallbackDays > 0) {
    return [];
  }

  return days;
}

function PeriodIcon({ name }: { name: string }) {
  const normalized = name.toLowerCase();

  if (normalized.includes("morning")) return <span>☀</span>;
  if (normalized.includes("afternoon")) return <span>◒</span>;
  if (normalized.includes("evening")) return <span>◐</span>;
  if (normalized.includes("night")) return <span>☾</span>;
  return <span>✦</span>;
}

export default function TripDetailPage() {
  const router = useRouter();
  const params = useParams();
  const [trip, setTrip] = useState<Trip | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!localStorage.getItem("token")) {
      router.push("/login");
      return;
    }

    async function loadTrip() {
      try {
        setTrip(await getTrip(Number(params.id)));
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : "Failed to load trip");
      } finally {
        setLoading(false);
      }
    }

    loadTrip();
  }, [params.id, router]);

  const itinerary = useMemo(
    () => (trip ? parseItinerary(trip.ai_recommendation || "", trip.days) : []),
    [trip]
  );

  if (loading) {
    return (
      <main className="kelana-page">
        <div className="kelana-state-card">
          <div className="kelana-loader" />
          <h2>Opening your journey...</h2>
          <p>Getting everything ready for your adventure.</p>
        </div>
      </main>
    );
  }

  if (error || !trip) {
    return (
      <main className="kelana-page">
        <Link href="/trips" className="kelana-back-link">
          ← My Journeys
        </Link>
        <div className="kelana-state-card error">
          <div className="kelana-state-icon">!</div>
          <h2>Journey not found.</h2>
          <p>{error || "We couldn't find this journey."}</p>
        </div>
      </main>
    );
  }

  const destinationHero = getDestinationHero(trip.destination);
  
  return (
    <main className="kelana-page kelana-detail">
      <div className="kelana-detail-topbar">
        <Link href="/trips" className="kelana-back-link">
          ← My Journeys
        </Link>
        <Link href="/chat" className="kelana-detail-chat-link">
          Ask KelanaAI <span>✦</span>
        </Link>
      </div>

      <section 
        className="kelana-detail-hero"
        style={{
          backgroundImage: `url("${destinationHero.image}")`,
        }}
      >
        <div className="kelana-detail-hero-overlay" />

        <div className="kelana-detail-hero-copy">
          <span className="kelana-eyebrow">YOUR NEXT ESCAPE</span>
          <h1>{trip.destination}</h1>
          <p>
            {trip.days} days · {trip.travel_style} · crafted with KelanaAI
          </p>
        </div>

        <div className="kelana-detail-stamp">
          <span>✈</span>
          <small>GO</small>
        </div>
      </section>

      <section className="kelana-detail-stats">
        <div>
          <span>Duration</span>
          <strong>{trip.days} days</strong>
        </div>
        <div>
          <span>Budget</span>
          <strong>USD {trip.budget.toLocaleString()}</strong>
        </div>
        <div>
          <span>Travel style</span>
          <strong>{trip.travel_style}</strong>
        </div>
        <div>
          <span>Trip type</span>
          <strong>{trip.category}</strong>
        </div>
      </section>

      <section className="kelana-itinerary">
        <div className="kelana-section-heading kelana-itinerary-heading">
          <div>
            <span className="kelana-eyebrow">YOUR PERSONAL PLAN</span>
            <h2>{trip.days}-day itinerary</h2>
          </div>
          <p>
            A day-by-day adventure shaped around your destination, budget and
            travel style.
          </p>
        </div>

        <div className="kelana-ai-note">
          <div className="kelana-ai-note-icon">✦</div>
          <div>
            <strong>Curated by KelanaAI</strong>
            <p>
              You can always ask KelanaAI to adjust this journey, find
              alternatives or plan around your preferences.
            </p>
          </div>
          <Link href="/chat">Ask AI →</Link>
        </div>

        <div className="kelana-day-list">
          {itinerary.map((day) => (
            <article className="kelana-day-card" key={day.day}>
              <div className="kelana-day-number">
                <span>DAY</span>
                <strong>{String(day.day).padStart(2, "0")}</strong>
              </div>

              <div className="kelana-day-main">
                <div className="kelana-day-title">
                  <h3>{day.title}</h3>
                  <span>{day.periods.reduce((sum, p) => sum + p.activities.length, 0)} activities</span>
                </div>

                <div className="kelana-period-list">
                  {day.periods.map((period) => (
                    <section className="kelana-period" key={`${day.day}-${period.name}`}>
                      <div className="kelana-period-heading">
                        <div className="kelana-period-icon">
                          <PeriodIcon name={period.name} />
                        </div>
                        <h4>{period.name}</h4>
                      </div>

                      <div className="kelana-activity-list">
                        {period.activities.map((activity, index) => (
                          <div
                            className="kelana-activity"
                            key={`${day.day}-${period.name}-${index}`}
                          >
                            <span className="kelana-activity-dot" />
                            <div>
                              <strong>{activity.title}</strong>
                              {activity.description && (
                                <p>{activity.description}</p>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </section>
                  ))}
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="kelana-detail-bottom-cta">
        <div>
          <span className="kelana-eyebrow">MAKE IT YOURS</span>
          <h2>Want to change the plan?</h2>
          <p>
            Tell KelanaAI what you want to add, remove or change.
          </p>
        </div>
        <Link href="/chat" className="kelana-button primary">
          Continue with KelanaAI <span>→</span>
        </Link>
      </section>
    </main>
  );
}
