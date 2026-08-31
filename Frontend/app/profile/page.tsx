"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function ProfilePage() {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      router.push("/login");
    }
  }, [router]);

  return (
    <main className="min-h-screen bg-[#eaf2fb] px-6 py-12">
      <div className="mx-auto max-w-4xl">
        <div className="rounded-3xl bg-white p-8 shadow-sm">
          <h1 className="text-3xl font-bold text-[#1a6fbf]">
            Profile
          </h1>

          <p className="mt-2 text-gray-500">
            Your KelanaAI profile
          </p>
        </div>
      </div>
    </main>
  );
}