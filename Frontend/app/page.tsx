"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import ReactMarkdown from "react-markdown";
import { generateTrip } from "@/services/tripService";

interface TripResult {
  destination: string;
  budget: number;
  days: number;
  category: string;
  daily_budget: number;
  ai_recommendation: string;
}

export default function Home() {
  const router = useRouter();

  const [destination, setDestination] = useState("Japan");
  const [budget, setBudget] = useState(2000);
  const [days, setDays] = useState(5);
  const [travelStyle, setTravelStyle] = useState("Family");

  const [result, setResult] = useState<TripResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      await generateTrip({
        destination,
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
    <main className="min-h-screen bg-gradient-to-br from-[#24000f] via-[#5b1634] to-[#d46b55] flex flex-col items-center py-10 sm:py-12 px-4 sm:px-6 relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-[-120px] left-[-100px] w-[350px] h-[350px] bg-[#ff9a76] opacity-20 blur-[100px] rounded-full" />

      <div className="absolute bottom-[-150px] right-[-100px] w-[400px] h-[400px] bg-[#d81b60] opacity-20 blur-[120px] rounded-full" />

      <div className="absolute top-[35%] right-[15%] w-[220px] h-[220px] bg-[#ffd166] opacity-10 blur-[100px] rounded-full" />
      {/* Header */}
      <h1 className="relative z-10 text-4xl font-bold text-white tracking-wide mb-1">
        KelanaAI
      </h1>

      <p className="relative z-10 text-white/70 text-sm mb-8">
        Plan your next adventure
      </p>

      {/* Hero Image */}
      <div className="relative z-10 w-full max-w-5xl h-64 sm:h-80 md:h-96 rounded-3xl overflow-hidden mb-8 shadow-2xl">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=1600&q=85')",
          }}
        />

        {/* Dark overlay */}
        <div className="absolute inset-0 bg-black/25" />

        {/* Hero text */}
        <div className="relative h-full flex flex-col justify-end p-6 sm:p-8 text-white">
          <p className="text-sm uppercase tracking-widest font-semibold">
            Discover your next destination
          </p>

          <h2 className="text-2xl sm:text-4xl font-bold mt-2">
            Your journey starts here.
          </h2>
        </div>
      </div>

      {/* Form card */}
      <form
        onSubmit={handleSubmit}
        className="relative z-10 w-full max-w-xl flex flex-col gap-4"
      >
        {/* Destination */}
        <div className="bg-white rounded-2xl px-5 py-4 shadow-sm">
          <label className="block text-xs font-bold text-[#1a6fbf] uppercase tracking-widest mb-1">
            Destination
          </label>
          <input
            type="text"
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
            required
            className="w-full text-gray-800 text-base bg-transparent outline-none"
            placeholder="e.g. Japan"
          />
        </div>

        {/* Budget */}
        <div className="bg-white rounded-2xl px-5 py-4 shadow-sm">
          <label className="block text-xs font-bold text-[#1a6fbf] uppercase tracking-widest mb-1">
            Budget (USD)
          </label>
          <input
            type="number"
            value={budget}
            onChange={(e) => setBudget(Number(e.target.value))}
            required
            min={1}
            className="w-full text-gray-800 text-base bg-transparent outline-none"
            placeholder="e.g. 2000"
          />
        </div>

        {/* Days */}
        <div className="bg-white rounded-2xl px-5 py-4 shadow-sm">
          <label className="block text-xs font-bold text-[#1a6fbf] uppercase tracking-widest mb-1">
            Days
          </label>
          <input
            type="number"
            value={days}
            onChange={(e) => setDays(Number(e.target.value))}
            required
            min={1}
            className="w-full text-gray-800 text-base bg-transparent outline-none"
            placeholder="e.g. 5"
          />
        </div>

        {/* Travel Style */}
        <div className="bg-white rounded-2xl px-5 py-4 shadow-sm">
          <label className="block text-xs font-bold text-[#1a6fbf] uppercase tracking-widest mb-1">
            Travel Style
          </label>
          <input
            type="text"
            value={travelStyle}
            onChange={(e) => setTravelStyle(e.target.value)}
            required
            className="w-full text-gray-800 text-base bg-transparent outline-none"
            placeholder="e.g. Family"
          />
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className="mt-2 bg-[#1a6fbf] hover:bg-[#155fa0] disabled:opacity-70 text-white font-semibold text-base rounded-full py-3 px-8 self-center transition-colors cursor-pointer flex items-center gap-3"
        >
          {loading && (
            <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
          )}

          {loading ? "Generating itinerary..." : "Generate AI Trip"}
        </button>
      </form>

      {loading && (
        <div className="mt-6 w-full max-w-md bg-white rounded-2xl shadow-sm px-5 py-5 text-center">
          <div className="flex justify-center mb-3">
            <div className="w-8 h-8 border-4 border-[#eaf2fb] border-t-[#1a6fbf] rounded-full animate-spin" />
          </div>

          <p className="font-semibold text-gray-800">
            Generating your itinerary...
          </p>

          <p className="text-sm text-gray-500 mt-1">
            Amazon Bedrock is creating your personalized travel plan.
          </p>
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="mt-6 w-full max-w-md bg-white border border-red-100 rounded-2xl shadow-sm px-5 py-5">
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 w-9 h-9 rounded-full bg-red-50 flex items-center justify-center">
              <span className="text-red-500 font-bold">!</span>
            </div>

            <div className="flex-1">
              <h3 className="font-semibold text-gray-800">
                Unable to generate itinerary
              </h3>

              <p className="text-sm text-gray-500 mt-1">
                Something went wrong while creating your travel plan.
              </p>

              <button
                type="button"
                onClick={handleSubmit}
                disabled={loading}
                className="mt-4 text-sm font-semibold text-[#1a6fbf] hover:underline disabled:opacity-50"
              >
                Try Again
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Result card */}
      {result && (
        <div className="mt-10 w-full max-w-4xl">

          {/* Result header */}
          <div className="mb-5">
            <p className="text-sm font-semibold text-[#1a6fbf] uppercase tracking-widest">
              Your personalized journey
            </p>

            <h2 className="text-3xl font-bold text-gray-900 mt-1">
              Your Trip Plan
            </h2>
          </div>

          {/* Trip summary */}
          <div className="bg-white rounded-3xl shadow-sm border border-blue-50 p-6 mb-6">

            <div className="flex items-center justify-between mb-5">
              <div>
                <p className="text-xs text-gray-400 uppercase tracking-widest">
                  Destination
                </p>

                <h3 className="text-2xl font-bold text-gray-900">
                  {result.destination}
                </h3>
              </div>

              <div className="bg-[#eaf2fb] rounded-2xl px-4 py-3 text-right">
                <p className="text-xs text-gray-500">
                  Travel Category
                </p>

                <p className="font-bold text-[#1a6fbf]">
                  {result.category}
                </p>
              </div>
            </div>

            {/* Trip stats */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">

              <div className="bg-gray-50 rounded-2xl p-4">
                <p className="text-xs text-gray-400 mb-1">
                  Duration
                </p>

                <p className="text-lg font-bold text-gray-800">
                  {result.days} days
                </p>
              </div>

              <div className="bg-gray-50 rounded-2xl p-4">
                <p className="text-xs text-gray-400 mb-1">
                  Total Budget
                </p>

                <p className="text-lg font-bold text-gray-800">
                  ${result.budget.toLocaleString()}
                </p>
              </div>

              <div className="bg-gray-50 rounded-2xl p-4">
                <p className="text-xs text-gray-400 mb-1">
                  Daily Budget
                </p>

                <p className="text-lg font-bold text-gray-800">
                  ${result.daily_budget.toLocaleString()}
                </p>
              </div>

            </div>
          </div>

          {/* AI itinerary */}
          <div className="bg-white rounded-3xl shadow-sm border border-blue-50 overflow-hidden">

            {/* AI header */}
            <div className="bg-[#1a6fbf] px-6 py-5 text-white">
              <p className="text-xs uppercase tracking-widest opacity-80">
                Powered by AI
              </p>

              <h3 className="text-2xl font-bold mt-1">
                Your AI Itinerary
              </h3>

              <p className="text-sm opacity-80 mt-1">
                A personalized travel plan created for your journey.
              </p>
            </div>

            {/* Markdown content */}
            <div className="px-6 py-7 md:px-8 md:py-8">

              <ReactMarkdown
                components={{
                  h1: ({ children }) => (
                    <h1 className="text-2xl font-bold text-gray-900 mb-5">
                      {children}
                    </h1>
                  ),

                  h2: ({ children }) => (
                    <h2 className="text-xl font-bold text-[#1a6fbf] mt-8 mb-4">
                      {children}
                    </h2>
                  ),

                  h3: ({ children }) => (
                    <h3 className="text-lg font-bold text-gray-900 mt-7 mb-3">
                      {children}
                    </h3>
                  ),

                  p: ({ children }) => (
                    <p className="text-gray-700 leading-7 mb-4">
                      {children}
                    </p>
                  ),

                  strong: ({ children }) => (
                    <strong className="font-bold text-gray-900">
                      {children}
                    </strong>
                  ),

                  ul: ({ children }) => (
                    <ul className="space-y-2 mb-5 ml-5 list-disc marker:text-[#1a6fbf]">
                      {children}
                    </ul>
                  ),

                  ol: ({ children }) => (
                    <ol className="space-y-2 mb-5 ml-5 list-decimal marker:text-[#1a6fbf] marker:font-bold">
                      {children}
                    </ol>
                  ),

                  li: ({ children }) => (
                    <li className="text-gray-700 leading-7 pl-1">
                      {children}
                    </li>
                  ),

                  hr: () => (
                    <hr className="my-8 border-gray-100" />
                  ),
                }}
              >
                {result.ai_recommendation}
              </ReactMarkdown>

            </div>
          </div>

        </div>
      )}

      {/* Footer */}
      <footer className="relative z-10 w-full max-w-5xl mt-16 border-t border-white/20 pt-8 pb-4">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-white/70 text-sm">

          <p>
            © 2026 KelanaAI. All rights reserved.
          </p>

          <div className="flex gap-6">
            <a
              href="#"
              className="hover:text-white transition-colors"
            >
              Home
            </a>

            <a
              href="#"
              className="hover:text-white transition-colors"
            >
              About
            </a>

            <a
              href="#"
              className="hover:text-white transition-colors"
            >
              Contact
            </a>
          </div>

        </div>
      </footer>
    </main>
  );
}
