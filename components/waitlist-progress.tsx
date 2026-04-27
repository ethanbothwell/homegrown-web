"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { waitlist, WaitlistStats, CommunityStats } from "@/lib/api";
import { Users, Sprout, MapPin } from "lucide-react";

// Poll the waitlist stats every 30 seconds so numbers tick live
const POLL_INTERVAL_MS = 30_000;

function ProgressBar({ value, max, color = "#2D5016" }: { value: number; max: number; color?: string }) {
  const pct = max > 0 ? Math.min(100, (value / max) * 100) : 0;
  return (
    <div className="h-1.5 rounded-full overflow-hidden" style={{ backgroundColor: "#e8e2d9" }}>
      <div
        className="h-full rounded-full transition-all duration-700"
        style={{ width: `${pct}%`, backgroundColor: color }}
      />
    </div>
  );
}

function CommunityCard({ c }: { c: CommunityStats }) {
  const totalPct = c.totalTarget > 0 ? Math.min(100, (c.totalCount / c.totalTarget) * 100) : 0;

  return (
    <div
      className="rounded-2xl p-5 flex flex-col gap-3"
      style={{
        backgroundColor: c.unlocked ? "rgba(45,80,22,0.06)" : "#ffffff",
        border: `1.5px solid ${c.unlocked ? "rgba(45,80,22,0.3)" : "#e8e2d9"}`,
      }}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <MapPin size={14} style={{ color: "#2D5016" }} />
          <span className="font-semibold text-sm" style={{ color: "#1a1a1a" }}>
            {c.name}
          </span>
        </div>
        {c.unlocked ? (
          <span
            className="text-xs font-bold px-2 py-0.5 rounded-full"
            style={{ backgroundColor: "#2D5016", color: "#FAF7F2" }}
          >
            Live
          </span>
        ) : (
          <span className="text-xs" style={{ color: "#aaa" }}>
            {Math.max(0, c.totalTarget - c.totalCount)} needed
          </span>
        )}
      </div>

      <ProgressBar value={c.totalCount} max={c.totalTarget} color={c.unlocked ? "#2D5016" : "#C4622D"} />

      <div className="flex gap-4 text-xs" style={{ color: "#6b6b6b" }}>
        <span className="flex items-center gap-1">
          <Sprout size={12} />
          {c.farmerCount}/{c.farmerTarget} farmers
        </span>
        <span className="flex items-center gap-1">
          <Users size={12} />
          {c.buyerCount}/{c.buyerTarget} buyers
        </span>
      </div>
    </div>
  );
}

export function WaitlistProgress() {
  const [stats, setStats] = useState<WaitlistStats | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const data = await waitlist.getStats();
        if (!cancelled) setStats(data);
      } catch {
        // silently ignore — the section just won't show
      }
    }

    load();
    const id = setInterval(load, POLL_INTERVAL_MS);
    return () => {
      cancelled = true;
      clearInterval(id);
    };
  }, []);

  if (!stats) return null;

  const globalPct =
    stats.totalTarget > 0
      ? Math.min(100, (stats.totalCount / stats.totalTarget) * 100)
      : 0;

  const activeCommunities = stats.communities.filter((c) => c.totalCount > 0);

  return (
    <section style={{ backgroundColor: "#FAF7F2" }} className="py-20 px-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <span
            className="inline-block text-xs font-bold tracking-widest uppercase mb-3 px-3 py-1 rounded-full"
            style={{ backgroundColor: "rgba(45,80,22,0.08)", color: "#2D5016" }}
          >
            Community Waitlist
          </span>
          <h2
            className="font-heading text-4xl font-bold mb-4"
            style={{ color: "#1a2e0a" }}
          >
            Unlock HomeGrown in your city.
          </h2>
          <p className="text-base max-w-xl mx-auto" style={{ color: "#6b6b6b", lineHeight: 1.7 }}>
            HomeGrown goes live community by community. Once{" "}
            <strong style={{ color: "#1a1a1a" }}>{stats.farmerTarget} farmers</strong> and{" "}
            <strong style={{ color: "#1a1a1a" }}>{stats.buyerTarget} buyers</strong> sign up in
            your area, the marketplace unlocks — fresh produce delivery, straight from local
            farms to your door.
          </p>
        </div>

        {/* Global progress */}
        <div
          className="rounded-2xl p-6 mb-8 text-center"
          style={{ backgroundColor: "#ffffff", border: "1.5px solid #e8e2d9" }}
        >
          <div className="flex justify-center gap-8 mb-4">
            <div>
              <div
                className="font-heading text-4xl font-bold"
                style={{ color: "#2D5016" }}
              >
                {stats.totalCount.toLocaleString()}
              </div>
              <div className="text-xs mt-0.5" style={{ color: "#6b6b6b" }}>
                people joined
              </div>
            </div>
            <div
              className="w-px self-stretch"
              style={{ backgroundColor: "#e8e2d9" }}
            />
            <div>
              <div
                className="font-heading text-4xl font-bold"
                style={{ color: "#C4622D" }}
              >
                {Math.max(0, stats.totalTarget - stats.totalCount).toLocaleString()}
              </div>
              <div className="text-xs mt-0.5" style={{ color: "#6b6b6b" }}>
                more needed (total)
              </div>
            </div>
          </div>

          <ProgressBar value={stats.totalCount} max={stats.totalTarget} />
          <p className="text-xs mt-2" style={{ color: "#aaa" }}>
            {globalPct.toFixed(0)}% of overall goal
          </p>
        </div>

        {/* Per-community cards */}
        {activeCommunities.length > 0 && (
          <>
            <h3
              className="text-sm font-bold tracking-wide uppercase mb-4"
              style={{ color: "#6b6b6b" }}
            >
              Progress by community
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-10">
              {activeCommunities.map((c) => (
                <CommunityCard key={c.name} c={c} />
              ))}
            </div>
          </>
        )}

        {/* CTA */}
        <div className="text-center">
          <Link
            href="/register"
            className="inline-block rounded-full px-8 py-4 font-semibold text-sm transition-all duration-300 hover:-translate-y-0.5"
            style={{
              backgroundColor: "#C4622D",
              color: "#ffffff",
              boxShadow: "0 4px 20px rgba(196,98,45,0.3)",
            }}
          >
            Join your community's waitlist
          </Link>
          <p className="text-xs mt-3" style={{ color: "#aaa" }}>
            Free forever for buyers. No credit card required.
          </p>
        </div>
      </div>
    </section>
  );
}
