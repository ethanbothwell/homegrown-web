"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { waitlist, WaitlistStats, CommunityStats } from "@/lib/api";
import { Users, Sprout, MapPin } from "lucide-react";

const POLL_INTERVAL_MS = 30_000;

// ─── Plant visual ─────────────────────────────────────────────────────────────

function PlantVisual({ pct }: { pct: number }) {
  const stage = pct >= 100 ? 4 : pct >= 75 ? 3 : pct >= 50 ? 2 : pct >= 25 ? 1 : 0;

  // Desaturate fully at 0%, full color at 100%
  const grayscale = Math.round(Math.max(0, 100 - pct));

  const STAGE_LABELS = [
    "Just sprouting…",
    "Growing…",
    "Taking shape…",
    "Almost there…",
    "Unlocked!",
  ];

  function appear(minStage: number): React.CSSProperties {
    const on = stage >= minStage;
    return {
      opacity: on ? 1 : 0,
      transform: on ? "translateY(0px)" : "translateY(10px)",
      transition: "opacity 1.2s ease, transform 1.2s ease",
    };
  }

  return (
    <div className="flex flex-col items-center select-none">
      <div
        style={{
          width: 220,
          filter: `grayscale(${grayscale}%)`,
          transition: "filter 1.8s ease",
        }}
      >
        <svg
          viewBox="0 0 200 310"
          xmlns="http://www.w3.org/2000/svg"
          style={{ overflow: "visible" }}
        >
          {/* ── Drop shadow ── */}
          <ellipse cx="100" cy="306" rx="54" ry="7" fill="rgba(0,0,0,0.09)" />

          {/* ── Pot body ── */}
          <path d="M 47 232 L 153 232 L 143 294 L 57 294 Z" fill="#9B4520" />
          {/* right-side shading */}
          <path d="M 153 232 L 148 232 L 138 294 L 143 294 Z" fill="rgba(0,0,0,0.15)" />
          {/* left-side highlight */}
          <path d="M 47 232 L 52 232 L 62 294 L 57 294 Z" fill="rgba(255,255,255,0.07)" />

          {/* ── Pot rim ── */}
          <rect x="30" y="213" width="140" height="21" rx="8" fill="#C4622D" />
          {/* rim top highlight */}
          <rect x="30" y="213" width="140" height="9" rx="8" fill="rgba(255,255,255,0.14)" />

          {/* ── Soil ── */}
          <ellipse cx="100" cy="216" rx="63" ry="11" fill="#241208" />
          <ellipse cx="100" cy="213" rx="47" ry="7"  fill="#3A1E0C" />
          {/* texture pebbles */}
          {([
            [76, 214], [88, 211], [104, 214], [116, 211], [94, 217], [110, 217],
          ] as [number, number][]).map(([x, y], i) => (
            <circle key={i} cx={x} cy={y} r="1.8" fill="rgba(255,255,255,0.07)" />
          ))}

          {/* ── Stem (fade in at stage 1) ── */}
          <path
            d="M 100 214 C 100 195 99 170 100 80"
            stroke="#4A7C3F"
            strokeWidth="3.2"
            fill="none"
            strokeLinecap="round"
            style={{
              opacity: stage >= 1 ? 1 : 0,
              transition: "opacity 1s ease",
            }}
          />

          {/* ── Sprout at stage 0 — always visible until stage 1 ── */}
          <path
            d="M 100 214 C 100 204 97 196 100 188 C 103 196 100 204 100 214 Z"
            fill="#82B25A"
            style={{
              opacity: stage === 0 ? 1 : 0,
              transition: "opacity 0.8s ease",
            }}
          />

          {/* ── Stem tip leaf — visible stage 1+ ── */}
          <g style={appear(1)}>
            <path
              d="M 100 100 C 96 90 95 79 100 70 C 105 79 104 90 100 100 Z"
              fill="#82B25A"
            />
          </g>

          {/* ── Stage 1: small leaf pair ── */}
          <g style={appear(1)}>
            {/* left */}
            <path
              d="M 100 194 C 88 182 68 186 64 197 C 68 207 90 203 100 197 Z"
              fill="#8CBF65"
            />
            <line
              x1="100" y1="194" x2="68" y2="198"
              stroke="#5B8A3F" strokeWidth="0.8"
              strokeLinecap="round" opacity="0.55"
            />
            {/* right */}
            <path
              d="M 100 194 C 112 182 132 186 136 197 C 132 207 110 203 100 197 Z"
              fill="#8CBF65"
            />
            <line
              x1="100" y1="194" x2="132" y2="198"
              stroke="#5B8A3F" strokeWidth="0.8"
              strokeLinecap="round" opacity="0.55"
            />
          </g>

          {/* ── Stage 2: medium leaf pair ── */}
          <g style={appear(2)}>
            {/* left */}
            <path
              d="M 99 157 C 83 141 55 147 50 163 C 56 175 85 171 99 161 Z"
              fill="#6BAD48"
            />
            <line
              x1="99" y1="157" x2="56" y2="164"
              stroke="#4A7C3F" strokeWidth="0.8"
              strokeLinecap="round" opacity="0.55"
            />
            {/* right */}
            <path
              d="M 101 157 C 117 141 145 147 150 163 C 144 175 115 171 101 161 Z"
              fill="#6BAD48"
            />
            <line
              x1="101" y1="157" x2="144" y2="164"
              stroke="#4A7C3F" strokeWidth="0.8"
              strokeLinecap="round" opacity="0.55"
            />
          </g>

          {/* ── Stage 3: large leaf pair ── */}
          <g style={appear(3)}>
            {/* left */}
            <path
              d="M 98 118 C 77 100 44 107 38 125 C 44 140 79 136 98 122 Z"
              fill="#559940"
            />
            <line
              x1="98" y1="118" x2="45" y2="126"
              stroke="#3D6B35" strokeWidth="0.8"
              strokeLinecap="round" opacity="0.55"
            />
            {/* right */}
            <path
              d="M 102 118 C 123 100 156 107 162 125 C 156 140 121 136 102 122 Z"
              fill="#559940"
            />
            <line
              x1="102" y1="118" x2="155" y2="126"
              stroke="#3D6B35" strokeWidth="0.8"
              strokeLinecap="round" opacity="0.55"
            />
          </g>

          {/* ── Stage 3: closed flower bud ── */}
          <g
            style={{
              opacity: stage === 3 ? 1 : 0,
              transition: "opacity 0.8s ease",
            }}
          >
            <path
              d="M 100 80 C 96 71 95 62 100 55 C 105 62 104 71 100 80 Z"
              fill="#D4A96A"
              opacity="0.75"
            />
            <ellipse cx="100" cy="61" rx="5" ry="7" fill="#C4622D" opacity="0.8" />
          </g>

          {/* ── Stage 4: open flower ── */}
          <g style={appear(4)}>
            {/* 6 petals at 60° intervals */}
            {([
              [112,  80,   0],
              [106,  90,  60],
              [ 94,  90, 120],
              [ 88,  80, 180],
              [ 94,  70, 240],
              [106,  70, 300],
            ] as [number, number, number][]).map(([cx, cy, rot], i) => (
              <ellipse
                key={i}
                cx={cx}
                cy={cy}
                rx="9"
                ry="5.5"
                fill="#D4A96A"
                transform={`rotate(${rot}, ${cx}, ${cy})`}
              />
            ))}
            {/* petal inner glow */}
            {([
              [112,  80,   0],
              [106,  90,  60],
              [ 94,  90, 120],
              [ 88,  80, 180],
              [ 94,  70, 240],
              [106,  70, 300],
            ] as [number, number, number][]).map(([cx, cy, rot], i) => (
              <ellipse
                key={`h${i}`}
                cx={cx}
                cy={cy}
                rx="5"
                ry="3"
                fill="rgba(255,255,255,0.2)"
                transform={`rotate(${rot}, ${cx}, ${cy})`}
              />
            ))}
            {/* flower center */}
            <circle cx="100" cy="80" r="9.5" fill="#C4622D" />
            <circle cx="100" cy="80" r="5.5" fill="#D96B3A" />
            <circle cx="100" cy="80" r="2.5" fill="#EE9060" />
          </g>
        </svg>
      </div>

      {/* Stage label */}
      <p
        className="text-sm font-semibold mt-1 transition-all duration-700"
        style={{ color: stage === 4 ? "#2D5016" : "#6b6b6b" }}
      >
        {STAGE_LABELS[stage]}
      </p>
      <p className="text-xs mt-0.5" style={{ color: "#bbb" }}>
        {Math.round(pct)}% to unlock
      </p>
    </div>
  );
}

// ─── Progress bar ─────────────────────────────────────────────────────────────

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

// ─── Community card ───────────────────────────────────────────────────────────

function CommunityCard({ c }: { c: CommunityStats }) {
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

// ─── Main section ─────────────────────────────────────────────────────────────

export function WaitlistProgress() {
  const [stats, setStats] = useState<WaitlistStats | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const data = await waitlist.getStats();
        if (!cancelled) setStats(data);
      } catch {
        // silently ignore
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
        <div className="text-center mb-10">
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
            <strong style={{ color: "#1a1a1a" }}>{stats.buyerTarget} buyers</strong> sign up
            in your area, the marketplace unlocks.
          </p>
        </div>

        {/* Plant visual — centrepiece */}
        <div className="flex justify-center mb-10">
          <PlantVisual pct={globalPct} />
        </div>

        {/* Global counter */}
        <div
          className="rounded-2xl p-6 mb-8 text-center"
          style={{ backgroundColor: "#ffffff", border: "1.5px solid #e8e2d9" }}
        >
          <div className="flex justify-center gap-8 mb-4">
            <div>
              <div className="font-heading text-4xl font-bold" style={{ color: "#2D5016" }}>
                {stats.totalCount.toLocaleString()}
              </div>
              <div className="text-xs mt-0.5" style={{ color: "#6b6b6b" }}>people joined</div>
            </div>
            <div className="w-px self-stretch" style={{ backgroundColor: "#e8e2d9" }} />
            <div>
              <div className="font-heading text-4xl font-bold" style={{ color: "#C4622D" }}>
                {Math.max(0, stats.totalTarget - stats.totalCount).toLocaleString()}
              </div>
              <div className="text-xs mt-0.5" style={{ color: "#6b6b6b" }}>more needed</div>
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
            Join your community&apos;s waitlist
          </Link>
          <p className="text-xs mt-3" style={{ color: "#aaa" }}>
            Free forever for buyers. No credit card required.
          </p>
        </div>
      </div>
    </section>
  );
}
