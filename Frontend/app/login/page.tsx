"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

function FreedomMark({ dark = false }: { dark?: boolean }) {
  return (
    <svg
      className="kelana-freedom-mark"
      viewBox="0 0 64 64"
      aria-hidden="true"
    >
      <path
        d="M32 12c-2.4 8.2-7.5 13.5-15.2 16.1C22 29.4 26.6 33 32 39c5.4-6 10-9.6 15.2-10.9C39.5 25.5 34.4 20.2 32 12Z"
        fill={dark ? "#087EA4" : "#FFFFFF"}
      />
      <path
        d="M32 20c-7.5 3.2-13.5 8.1-18.2 14.8C20.7 33 27 35.7 32 41c5-5.3 11.3-8 18.2-6.2C45.5 28.1 39.5 23.2 32 20Z"
        fill={dark ? "#12B5CB" : "#FFFFFF"}
        opacity=".9"
      />
      <path
        d="M17 42c5.8-2.8 10.8-2.6 15 1.1 4.2-3.7 9.2-3.9 15-1.1-3.1 5.8-8.1 9-15 9.7-6.9-.7-11.9-3.9-15-9.7Z"
        fill={dark ? "#FF8A5B" : "#FFFFFF"}
      />
    </svg>
  );
}

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) {
        throw new Error("Invalid email or password");
      }

      const data = await res.json();
      localStorage.setItem("token", data.access_token);
      router.push("/");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="kelana-login">
      <section className="kelana-login-visual">
        <div className="kelana-login-visual-overlay" />

        <div className="kelana-login-brand-badge">
          <FreedomMark />
        </div>

        <div className="kelana-login-visual-copy">
          <span className="kelana-login-kicker">YOUR NEXT ESCAPE</span>

          <h1>
            Leave the routine.
            <br />
            <em>Find your freedom.</em>
          </h1>

          <p>
            New places. New stories. One journey at a time.
          </p>
        </div>

        <div className="kelana-login-location">
          <span className="kelana-location-dot" />
          <span>THE WORLD IS WAITING</span>
        </div>
      </section>

      <section className="kelana-login-panel">
        <div className="kelana-login-inner">
          <div className="kelana-login-brand">
            <div className="kelana-login-brand-icon">
              <FreedomMark dark />
            </div>
            <div className="kelana-login-brand-wordmark">
              <strong>Kelana</strong>
              <span>AI</span>
            </div>
          </div>

          <div className="kelana-login-heading">
            <span className="kelana-eyebrow">WELCOME BACK</span>
            <h2>Ready for your next adventure?</h2>
            <p>
              Sign in and pick up where your journey left off.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="kelana-login-form">
            <label>
              Email
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                autoComplete="email"
                required
              />
            </label>

            <label>
              Password
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                autoComplete="current-password"
                required
              />
            </label>

            {error && <p className="kelana-login-error">{error}</p>}

            <button type="submit" disabled={loading}>
              <span>
                {loading ? "Opening your journey..." : "Continue your journey"}
              </span>
              <strong>→</strong>
            </button>
          </form>

          <div className="kelana-login-note">
            <span>✦</span>
            <p>
              Your travel companion for destinations, itineraries and
              spontaneous ideas.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
