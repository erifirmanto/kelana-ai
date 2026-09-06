"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { askQuestion } from "@/services/tripService";

interface Source {
  document_id?: string;
  location?: {
    s3Location?: {
      uri?: string;
    };
  };
  metadata?: {
    _document_title?: string;
  };
  score?: number;
}

interface AskResponse {
  question: string;
  answer: string;
  source: Source[];
}

export default function AssistantPage() {
  const router = useRouter();

  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [sources, setSources] = useState<Source[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleAsk() {
    if (!question.trim()) {
      return;
    }

    try {
      setLoading(true);
      setError("");
      setAnswer("");
      setSources([]);

      const result: AskResponse = await askQuestion(question);

      setAnswer(result.answer);
      setSources(result.source || []);
    } catch (err: unknown) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to get answer"
      );
    } finally {
      setLoading(false);
    }
  }

  function handleLogout() {
    localStorage.removeItem("token");
    router.push("/login");
  }

  return (
    <main className="min-h-screen bg-[#eaf2fb] px-6 py-12">
      <div className="mx-auto max-w-4xl">

        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold text-[#1a6fbf]">
              Travel Assistant
            </h1>

            <p className="mt-2 text-gray-500">
              Ask KelanaAI about your travel plans
            </p>
          </div>

          <button
            onClick={handleLogout}
            className="rounded-full bg-[#1f2937] px-6 py-3 font-semibold text-white hover:bg-[#111827]"
          >
            Logout
          </button>
        </div>

        <div className="mt-8 rounded-3xl bg-white p-8 shadow-sm">

          <h2 className="text-2xl font-bold text-gray-800">
            Ask KelanaAI
          </h2>

          <p className="mt-2 text-gray-500">
            Powered by your trusted travel documents
          </p>

          <textarea
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="Can I bring medication into Japan?"
            rows={4}
            className="mt-6 w-full rounded-2xl border border-gray-300 px-5 py-4 text-gray-800 outline-none placeholder:text-gray-400 focus:border-[#1a6fbf] focus:ring-2 focus:ring-[#1a6fbf]/20"
          />

          <button
            onClick={handleAsk}
            disabled={loading || !question.trim()}
            className="mt-4 rounded-full bg-[#1a6fbf] px-8 py-3 font-semibold text-white hover:bg-[#155fa0] disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? "Asking..." : "Ask →"}
          </button>

          {error && (
            <div className="mt-6 rounded-2xl bg-red-50 p-4 text-red-600">
              {error}
            </div>
          )}

          {answer && (
            <div className="mt-8">

              <h3 className="text-xl font-bold text-gray-800">
                AI Answer
              </h3>

              <div className="mt-4 rounded-2xl bg-[#eaf2fb] p-6">
                <p className="whitespace-pre-wrap leading-relaxed text-gray-700">
                  {answer}
                </p>
              </div>

            </div>
          )}

          {sources.length > 0 && (
            <div className="mt-8 border-t border-gray-100 pt-8">

              <h3 className="text-xl font-bold text-gray-800">
                Source
              </h3>

              <div className="mt-4 flex flex-col gap-3">
                {sources.map((source, index) => {
                  const documentTitle =
                    source.metadata?._document_title ||
                    source.document_id ||
                    "Knowledge Base document";

                  return (
                    <div
                      key={index}
                      className="rounded-2xl bg-gray-50 p-5"
                    >
                      <p className="font-semibold text-gray-800">
                        📄 {documentTitle}
                      </p>

                      {source.score !== undefined && (
                        <p className="mt-1 text-sm text-gray-500">
                          Relevance score:{" "}
                          {source.score.toFixed(3)}
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>

              <p className="mt-4 text-sm text-gray-500">
                Answers are grounded in your uploaded documents.
              </p>

            </div>
          )}

        </div>
      </div>
    </main>
  );
} 