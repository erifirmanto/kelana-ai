"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { generateTrip } from "@/services/tripService";

export default function Home() {
  const router = useRouter();

  const [destination, setDestination] = useState("");
  const [budget, setBudget] = useState(2000);
  const [days, setDays] = useState(5);
  const [travelStyle, setTravelStyle] = useState("Family");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!localStorage.getItem("token")) {
      router.push("/login");
    }
  }, [router]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!destination.trim()) {
      setError("Tell us where you want to go.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      await generateTrip({
        destination: destination.trim(),
        budget,
        days,
        travel_style: travelStyle,
      });

      router.push("/trips");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="kelana-page kelana-home">
      <section className="kelana-hero">
        <div className="kelana-hero-copy">
          <span className="kelana-eyebrow">YOUR AI TRAVEL COMPANION</span>

          <h1>
            Escape the ordinary.
            <br />
            <em>Go somewhere.</em>
          </h1>

          <p>
            Tell KelanaAI what kind of adventure you&apos;re dreaming about.
            We&apos;ll help turn that idea into a journey worth remembering.
          </p>

          <div className="kelana-hero-actions">
            <a href="#plan" className="kelana-button primary">
              Start planning <span>→</span>
            </a>
            <Link href="/chat" className="kelana-button secondary">
              Talk to KelanaAI <span>✦</span>
            </Link>
          </div>
        </div>

        <div className="kelana-hero-image">
          <div className="kelana-hero-image-overlay" />
          <div className="kelana-hero-caption">
            <span>THE WORLD IS WAITING</span>
            <strong>Where will you go next?</strong>
          </div>
          <div className="kelana-sun" />
          <div className="kelana-sticker">✈</div>
        </div>
      </section>

      <section id="plan" className="kelana-plan-section">
        <div className="kelana-section-heading">
          <div>
            <span className="kelana-eyebrow">MAKE IT REAL</span>
            <h2>Start your next journey.</h2>
          </div>
          <p>No complicated planning. Just tell us what you want.</p>
        </div>

        <form onSubmit={handleSubmit} className="kelana-plan-card">
          <div className="kelana-field destination-field">
            <label>Where do you want to go?</label>
            <div className="kelana-input-wrap">
              <span>⌖</span>
              <input
                type="text"
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                placeholder="Japan, Bali, New Zealand..."
                required
              />
            </div>
          </div>

          <div className="kelana-field">
            <label>Budget</label>
            <div className="kelana-input-wrap">
              <span>$</span>
              <input
                type="number"
                min={1}
                value={budget}
                onChange={(e) => setBudget(Number(e.target.value))}
                required
              />
            </div>
          </div>

          <div className="kelana-field">
            <label>Days</label>
            <div className="kelana-input-wrap">
              <span>◷</span>
              <input
                type="number"
                min={1}
                value={days}
                onChange={(e) => setDays(Number(e.target.value))}
                required
              />
            </div>
          </div>

          <div className="kelana-field">
            <label>Travel style</label>
            <select
              value={travelStyle}
              onChange={(e) => setTravelStyle(e.target.value)}
            >
              <option>Solo</option>
              <option>Couple</option>
              <option>Family</option>
              <option>Backpacker</option>
              <option>Luxury</option>
            </select>
          </div>

          <button className="kelana-submit" disabled={loading}>
            {loading ? "Creating your journey..." : "Create my journey"}
            <span>→</span>
          </button>

          {error && <p className="kelana-form-error">{error}</p>}
        </form>
      </section>

      <section className="kelana-feature-strip">
        <div>
          <span>✦</span>
          <strong>AI-powered planning</strong>
          <p>Personalized ideas built around you.</p>
        </div>
        <div>
          <span>◒</span>
          <strong>Keep your journeys</strong>
          <p>Your travel history stays with you.</p>
        </div>
        <div>
          <span>☼</span>
          <strong>Ask anything</strong>
          <p>Chat with your travel companion anytime.</p>
        </div>
      </section>

      <footer className="kelana-footer">
        <strong>KelanaAI</strong>
        <span>Plan less. Experience more.</span>
      </footer>
    </main>
  );
}
