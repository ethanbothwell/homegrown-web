"use client";

import { useState } from "react";
import Link from "next/link";
import { Nav } from "@/components/nav";
import { newsletter } from "@/lib/api";
import { toast } from "sonner";
import { ArrowRight, Leaf, Package, Handshake } from "lucide-react";
import { WaitlistProgress } from "@/components/waitlist-progress";

const HERO_IMAGE =
  "https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=1600&q=80";

// ─── Testimonials ─────────────────────────────────────────────────────────────

const TESTIMONIALS = [
  {
    quote: "The quality is completely different. Everything tastes the way I remember food tasting as a kid.",
    name: "Sarah M.",
    location: "Portland, OR",
    initial: "S",
  },
  {
    quote: "I love that I can see exactly where my food comes from. Knowing my farmer makes every meal feel intentional.",
    name: "Daniel R.",
    location: "Corvallis, OR",
    initial: "D",
  },
  {
    quote: "Cancelled my Instacart membership. Why pay a markup when I can get better food directly from the source?",
    name: "Priya K.",
    location: "Eugene, OR",
    initial: "P",
  },
];

export default function HomePage() {
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleNewsletter(e: React.SyntheticEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!email) return;
    setSubmitting(true);
    try {
      const res = await newsletter.subscribe(email);
      if (res.duplicate) {
        toast.info("You're already on the list.");
      } else {
        toast.success("You're on the list. We'll be in touch.");
        setEmail("");
      }
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <>
      <Nav />

      {/* ─── HERO ─────────────────────────────────────────────────────────── */}
      <section
        className="relative flex flex-col items-center justify-center text-center"
        style={{
          minHeight: "100svh",
          backgroundImage: `url('${HERO_IMAGE}')`,
          backgroundSize: "cover",
          backgroundPosition: "center 40%",
        }}
      >
        <div
          className="absolute inset-0"
          style={{
            background: "linear-gradient(to bottom, rgba(8,18,4,0.18) 0%, rgba(8,18,4,0.58) 60%, rgba(8,18,4,0.72) 100%)",
          }}
        />

        <div className="relative z-10 max-w-2xl mx-auto px-6 pt-24 pb-20">
          {/* Eyebrow — restrained, no all-caps shouting */}
          <p
            className="font-heading italic mb-6 tracking-wide"
            style={{ fontSize: "1.05rem", color: "rgba(255,255,255,0.75)", letterSpacing: "0.04em" }}
          >
            Local. Seasonal. Real.
          </p>

          <h1
            className="font-heading font-semibold mb-6"
            style={{
              fontSize: "clamp(2.6rem, 6.5vw, 5rem)",
              color: "#ffffff",
              lineHeight: 1.08,
              letterSpacing: "-0.03em",
            }}
          >
            Know your farmer.<br />
            <span style={{ color: "rgba(255,255,255,0.88)" }}>Love your food.</span>
          </h1>

          <p
            style={{
              fontSize: "clamp(0.95rem, 1.8vw, 1.15rem)",
              color: "rgba(255,255,255,0.75)",
              lineHeight: 1.7,
              marginBottom: "2.5rem",
              fontWeight: 400,
            }}
          >
            Direct from small farms to your table.<br />
            Subscribe, discover, and eat better — starting in Oregon.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
            <Link href="/register">
              <button
                className="inline-flex items-center gap-2 font-semibold transition-all duration-200 hover:-translate-y-px"
                style={{
                  backgroundColor: "#B85C27",
                  color: "#ffffff",
                  padding: "0.85rem 2rem",
                  borderRadius: "0.6rem",
                  fontSize: "0.95rem",
                  letterSpacing: "0.01em",
                  boxShadow: "0 4px 20px rgba(184,92,39,0.45)",
                }}
              >
                Join the waitlist
                <ArrowRight size={15} />
              </button>
            </Link>
            <Link href="/demo">
              <button
                className="inline-flex items-center gap-2 font-medium transition-all duration-200 hover:bg-white/20"
                style={{
                  background: "transparent",
                  color: "rgba(255,255,255,0.9)",
                  padding: "0.85rem 2rem",
                  borderRadius: "0.6rem",
                  fontSize: "0.95rem",
                  border: "1.5px solid rgba(255,255,255,0.45)",
                }}
              >
                Preview the app
              </button>
            </Link>
          </div>
        </div>

        {/* Scroll hint */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2">
          <div
            className="w-px h-10 opacity-40"
            style={{ background: "linear-gradient(to bottom, transparent, rgba(255,255,255,0.8))" }}
          />
        </div>
      </section>

      {/* ─── TRUST BAR ────────────────────────────────────────────────────── */}
      <div style={{ backgroundColor: "#ffffff", borderBottom: "1px solid #E2DBD0" }}>
        <div className="max-w-5xl mx-auto px-6 py-5 flex flex-wrap justify-center sm:justify-between items-center gap-4">
          {[
            "Small-batch, seasonal produce",
            "No middlemen — farmers set their prices",
            "Cancel or pause anytime",
            "Community-unlocked delivery areas",
          ].map((item) => (
            <span
              key={item}
              className="flex items-center gap-2 text-sm font-medium"
              style={{ color: "#6B6560" }}
            >
              <span style={{ color: "#2D5016", fontSize: "1rem" }}>✦</span>
              {item}
            </span>
          ))}
        </div>
      </div>

      {/* ─── VALUE PROPS ──────────────────────────────────────────────────── */}
      <section style={{ backgroundColor: "#FAF7F2", padding: "6rem 0" }}>
        <div className="max-w-5xl mx-auto px-6">

          <div className="max-w-xl mb-16">
            <p
              className="text-sm font-semibold mb-3"
              style={{ color: "#B85C27", letterSpacing: "0.08em", textTransform: "uppercase" }}
            >
              Why HomeGrown
            </p>
            <h2
              className="font-heading font-semibold"
              style={{ fontSize: "clamp(1.9rem, 3.5vw, 2.75rem)", color: "#1C1A17", lineHeight: 1.15 }}
            >
              Food should come<br />from people, not warehouses.
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-px" style={{ backgroundColor: "#E2DBD0" }}>
            {[
              {
                Icon: Leaf,
                title: "Know your farmer",
                body: "Every farm on HomeGrown has a full profile — their story, practices, and land. You know exactly where your food comes from.",
              },
              {
                Icon: Package,
                title: "Flexible subscriptions",
                body: "Weekly, biweekly, or monthly. Pause whenever life gets busy, cancel anytime. Your schedule, your terms.",
              },
              {
                Icon: Handshake,
                title: "Fair for everyone",
                body: "Farmers keep more of what they earn. You pay less than specialty grocery. No middlemen, no markups.",
              },
            ].map((v) => (
              <div
                key={v.title}
                className="p-10 flex flex-col gap-5"
                style={{ backgroundColor: "#FAF7F2" }}
              >
                <div
                  className="flex items-center justify-center flex-shrink-0"
                  style={{ width: 44, height: 44, backgroundColor: "rgba(45,80,22,0.08)", borderRadius: "0.5rem" }}
                >
                  <v.Icon size={20} style={{ color: "#2D5016" }} />
                </div>
                <div>
                  <h3
                    className="font-semibold mb-2"
                    style={{ fontSize: "1.05rem", color: "#1C1A17", letterSpacing: "-0.01em" }}
                  >
                    {v.title}
                  </h3>
                  <p style={{ fontSize: "0.9rem", color: "#6B6560", lineHeight: 1.7 }}>
                    {v.body}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── HOW IT WORKS ─────────────────────────────────────────────────── */}
      <section style={{ backgroundColor: "#ffffff", padding: "6rem 0", borderTop: "1px solid #E2DBD0" }}>
        <div className="max-w-5xl mx-auto px-6">
          <div className="max-w-xl mb-16">
            <p
              className="text-sm font-semibold mb-3"
              style={{ color: "#B85C27", letterSpacing: "0.08em", textTransform: "uppercase" }}
            >
              How it works
            </p>
            <h2
              className="font-heading font-semibold"
              style={{ fontSize: "clamp(1.9rem, 3.5vw, 2.75rem)", color: "#1C1A17" }}
            >
              Fresh food in three steps.
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-12">
            {[
              {
                n: "01",
                title: "Browse local farms",
                body: "Search farms near you. Read their story, see their practices, explore what they grow.",
              },
              {
                n: "02",
                title: "Choose a plan",
                body: "Pick a weekly veggie box, a monthly meat share, or whatever fits your household and budget.",
              },
              {
                n: "03",
                title: "Receive deliveries",
                body: "Your farmer prepares your box fresh and delivers it on schedule. Pause or cancel anytime, no penalties.",
              },
            ].map((s) => (
              <div key={s.n}>
                <span
                  className="font-heading font-bold block mb-4"
                  style={{ fontSize: "0.8rem", color: "#B85C27", letterSpacing: "0.12em" }}
                >
                  {s.n}
                </span>
                <div
                  className="mb-5"
                  style={{ width: 36, height: 2, backgroundColor: "#2D5016", borderRadius: 2 }}
                />
                <h3
                  className="font-semibold mb-2"
                  style={{ fontSize: "1.1rem", color: "#1C1A17", letterSpacing: "-0.01em" }}
                >
                  {s.title}
                </h3>
                <p style={{ fontSize: "0.9rem", color: "#6B6560", lineHeight: 1.7 }}>
                  {s.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── TESTIMONIALS ─────────────────────────────────────────────────── */}
      <section style={{ backgroundColor: "#F4EFE6", padding: "5rem 0", borderTop: "1px solid #E2DBD0" }}>
        <div className="max-w-5xl mx-auto px-6">
          <p
            className="text-sm font-semibold text-center mb-12"
            style={{ color: "#6B6560", letterSpacing: "0.08em", textTransform: "uppercase" }}
          >
            What people are saying
          </p>

          <div className="grid md:grid-cols-3 gap-8">
            {TESTIMONIALS.map((t) => (
              <div
                key={t.name}
                className="flex flex-col gap-5 p-7"
                style={{
                  backgroundColor: "#ffffff",
                  borderRadius: "0.75rem",
                  border: "1px solid #E2DBD0",
                }}
              >
                <p
                  className="font-heading italic flex-1"
                  style={{ fontSize: "1rem", color: "#3A3530", lineHeight: 1.65 }}
                >
                  &ldquo;{t.quote}&rdquo;
                </p>
                <div className="flex items-center gap-3">
                  <div
                    className="flex items-center justify-center text-sm font-semibold flex-shrink-0"
                    style={{
                      width: 36,
                      height: 36,
                      borderRadius: "50%",
                      backgroundColor: "rgba(45,80,22,0.1)",
                      color: "#2D5016",
                    }}
                  >
                    {t.initial}
                  </div>
                  <div>
                    <p className="text-sm font-semibold" style={{ color: "#1C1A17" }}>{t.name}</p>
                    <p className="text-xs" style={{ color: "#9B9590" }}>{t.location}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── COMMUNITY WAITLIST ───────────────────────────────────────────── */}
      <div id="waitlist" style={{ borderTop: "1px solid #E2DBD0" }}>
        <WaitlistProgress />
      </div>

      {/* ─── FARMER CTA ───────────────────────────────────────────────────── */}
      <section style={{ backgroundColor: "#2D5016", padding: "6rem 0" }}>
        <div className="max-w-5xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div>
              <p
                className="text-sm font-semibold mb-4"
                style={{ color: "rgba(212,169,106,0.85)", letterSpacing: "0.08em", textTransform: "uppercase" }}
              >
                For farmers
              </p>
              <h2
                className="font-heading font-semibold mb-5"
                style={{ fontSize: "clamp(1.9rem, 3.5vw, 2.75rem)", color: "#ffffff", lineHeight: 1.12 }}
              >
                Grow your community,<br />not just your crops.
              </h2>
              <p
                className="mb-8 leading-relaxed"
                style={{ color: "rgba(255,255,255,0.7)", fontSize: "0.95rem", lineHeight: 1.75 }}
              >
                List your farm, create subscription plans, and build direct
                relationships with customers who value your work.
                Free to join — no commission until you&apos;re ready.
              </p>
              <Link href="/register?role=Farmer">
                <button
                  className="inline-flex items-center gap-2 font-semibold transition-all duration-200 hover:-translate-y-px"
                  style={{
                    backgroundColor: "#ffffff",
                    color: "#2D5016",
                    padding: "0.85rem 2rem",
                    borderRadius: "0.6rem",
                    fontSize: "0.95rem",
                    letterSpacing: "0.01em",
                  }}
                >
                  List your farm
                  <ArrowRight size={15} />
                </button>
              </Link>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-5">
              {[
                { stat: "0%", label: "Commission during launch" },
                { stat: "Direct", label: "Pricing — you decide" },
                { stat: "Weekly", label: "Automatic payouts" },
                { stat: "Free", label: "To list and get started" },
              ].map((item) => (
                <div
                  key={item.label}
                  className="p-6"
                  style={{
                    backgroundColor: "rgba(255,255,255,0.07)",
                    borderRadius: "0.75rem",
                    border: "1px solid rgba(255,255,255,0.12)",
                  }}
                >
                  <p
                    className="font-heading font-bold mb-1"
                    style={{ fontSize: "1.75rem", color: "#ffffff", letterSpacing: "-0.03em" }}
                  >
                    {item.stat}
                  </p>
                  <p style={{ fontSize: "0.82rem", color: "rgba(255,255,255,0.55)" }}>
                    {item.label}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ─── NEWSLETTER ───────────────────────────────────────────────────── */}
      <section style={{ backgroundColor: "#FAF7F2", padding: "5rem 0", borderTop: "1px solid #E2DBD0" }}>
        <div className="max-w-xl mx-auto px-6 text-center">
          <h2
            className="font-heading font-semibold mb-3"
            style={{ fontSize: "clamp(1.6rem, 3vw, 2.2rem)", color: "#1C1A17" }}
          >
            From the farm, to your inbox.
          </h2>
          <p className="mb-7" style={{ color: "#6B6560", fontSize: "0.95rem", lineHeight: 1.7 }}>
            Seasonal finds, farm stories, and early access to new products.
          </p>

          <form
            onSubmit={handleNewsletter}
            className="flex flex-col sm:flex-row gap-2.5 justify-center items-stretch max-w-sm mx-auto"
          >
            <input
              type="email"
              placeholder="your@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="flex-1 px-4 py-3 text-sm outline-none rounded-lg"
              style={{
                border: "1.5px solid #E2DBD0",
                backgroundColor: "#ffffff",
                color: "#1C1A17",
                minWidth: 0,
              }}
              onFocus={(e) => (e.target.style.borderColor = "#2D5016")}
              onBlur={(e) => (e.target.style.borderColor = "#E2DBD0")}
            />
            <button
              type="submit"
              disabled={submitting}
              className="px-6 py-3 text-sm font-semibold rounded-lg whitespace-nowrap transition-all disabled:opacity-60"
              style={{ backgroundColor: "#2D5016", color: "#ffffff" }}
            >
              {submitting ? "Joining…" : "Subscribe"}
            </button>
          </form>
          <p className="mt-4 text-xs" style={{ color: "#9B9590" }}>
            No spam. Unsubscribe anytime.
          </p>
        </div>
      </section>

      {/* ─── FOOTER ───────────────────────────────────────────────────────── */}
      <footer style={{ backgroundColor: "#1a2e0a" }}>
        <div className="max-w-5xl mx-auto px-6 pt-14 pb-0">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 pb-12">

            {/* Brand */}
            <div>
              <div className="flex items-center gap-2.5 mb-4">
                <svg width="22" height="22" viewBox="0 0 28 28" fill="none">
                  <path d="M14 3C14 3 5 9 5 17C5 21.418 9.134 25 14 25C18.866 25 23 21.418 23 17C23 9 14 3 14 3Z" fill="#87A878"/>
                  <path d="M14 8C14 8 9 12 9 17C9 19.761 11.239 22 14 22C16.761 22 19 19.761 19 17C19 12 14 8 14 8Z" fill="#FAF7F2" opacity="0.4"/>
                </svg>
                <span className="font-heading font-semibold text-lg" style={{ color: "#FAF7F2" }}>HomeGrown</span>
              </div>
              <p className="text-sm leading-relaxed" style={{ color: "rgba(250,247,242,0.5)", maxWidth: "22ch" }}>
                Connecting farmers and communities who care about where their food comes from.
              </p>
            </div>

            {/* Explore */}
            <div>
              <h6
                className="text-xs font-semibold tracking-widest uppercase mb-5"
                style={{ color: "rgba(250,247,242,0.4)" }}
              >
                Explore
              </h6>
              <ul className="space-y-3 text-sm">
                {[
                  { label: "Browse Farms", href: "/farms" },
                  { label: "Marketplace", href: "/marketplace" },
                  { label: "Farm Map", href: "/map" },
                  { label: "Sell on HomeGrown", href: "/register?role=Farmer" },
                ].map((l) => (
                  <li key={l.label}>
                    <Link
                      href={l.href}
                      className="transition-colors hover:text-white"
                      style={{ color: "rgba(250,247,242,0.55)" }}
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Account */}
            <div>
              <h6
                className="text-xs font-semibold tracking-widest uppercase mb-5"
                style={{ color: "rgba(250,247,242,0.4)" }}
              >
                Account
              </h6>
              <ul className="space-y-3 text-sm">
                {[
                  { label: "Sign In", href: "/login" },
                  { label: "Create Account", href: "/register" },
                  { label: "My Subscriptions", href: "/my-subscriptions" },
                  { label: "Dashboard", href: "/dashboard" },
                ].map((l) => (
                  <li key={l.label}>
                    <Link
                      href={l.href}
                      className="transition-colors hover:text-white"
                      style={{ color: "rgba(250,247,242,0.55)" }}
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div style={{ borderTop: "1px solid rgba(255,255,255,0.07)" }}>
          <div className="max-w-5xl mx-auto px-6 py-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <p className="text-xs" style={{ color: "rgba(250,247,242,0.3)" }}>
              © 2026 HomeGrown. Made with care for local food systems.
            </p>
            <div className="flex gap-5">
              {["Privacy", "Terms"].map((l) => (
                <a
                  key={l}
                  href="#"
                  className="text-xs transition-colors hover:text-white"
                  style={{ color: "rgba(250,247,242,0.3)" }}
                >
                  {l}
                </a>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}
