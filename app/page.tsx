"use client";

import { useState } from "react";
import Link from "next/link";
import { Nav } from "@/components/nav";
import { Button } from "@/components/ui/button";
import { newsletter } from "@/lib/api";
import { toast } from "sonner";
import { Leaf, Package, Handshake, Map, ShoppingBag, Truck } from "lucide-react";

const PRODUCE_IMAGE =
  "https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=1600&q=80";

export default function HomePage() {
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleWaitlist(e: React.SyntheticEvent<HTMLFormElement>) {
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

      {/* ─── HERO ─────────────────────────────── */}
      <section
        className="relative flex items-center justify-center text-center"
        style={{
          minHeight: "100vh",
          backgroundImage: `url('${PRODUCE_IMAGE}')`,
          backgroundSize: "cover",
          backgroundAttachment: "fixed",
          backgroundPosition: "center",
        }}
      >
        {/* overlay */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(160deg, rgba(20,40,10,0.55) 0%, rgba(0,0,0,0.4) 100%)",
          }}
        />

        <div className="relative z-10 max-w-3xl mx-auto px-6 py-32">
          <p
            className="text-xs font-bold tracking-[0.16em] uppercase mb-5"
            style={{ color: "#D4A96A" }}
          >
            Local. Seasonal. Real.
          </p>
          <h1
            className="font-heading font-bold leading-[1.08] mb-6"
            style={{
              fontSize: "clamp(2.8rem, 7vw, 5.5rem)",
              color: "#ffffff",
              textShadow: "0 2px 12px rgba(0,0,0,0.3)",
            }}
          >
            Know Your Farmer.<br />Love Your Food.
          </h1>
          <p
            className="font-light leading-relaxed mb-10 max-w-xl mx-auto"
            style={{
              fontSize: "clamp(1rem, 2vw, 1.3rem)",
              color: "rgba(255,255,255,0.88)",
            }}
          >
            Fresh, local, and grown with intention.<br />
            Direct from small farms to your table.
          </p>

          <div className="flex flex-wrap gap-3 justify-center">
            <Link href="/farms">
              <Button
                size="lg"
                className="rounded-full px-8 font-semibold text-base border-0 transition-all duration-300 hover:-translate-y-0.5"
                style={{
                  backgroundColor: "#C4622D",
                  color: "#ffffff",
                  boxShadow: "0 4px 16px rgba(196,98,45,0.4)",
                }}
              >
                Browse Farms
              </Button>
            </Link>
            <Link href="/register">
              <Button
                size="lg"
                className="rounded-full px-8 font-semibold text-base transition-all duration-300 hover:bg-white/20"
                style={{
                  background: "rgba(255,255,255,0.1)",
                  color: "#ffffff",
                  border: "2px solid rgba(255,255,255,0.8)",
                }}
              >
                Join Free
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* ─── VALUE PROPS ──────────────────────── */}
      <section className="py-24" style={{ backgroundColor: "#FAF7F2" }}>
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <span
              className="text-xs font-bold tracking-[0.12em] uppercase"
              style={{ color: "#C4622D" }}
            >
              Why HomeGrown
            </span>
            <h2
              className="font-heading font-bold mt-2"
              style={{ fontSize: "clamp(1.8rem, 3.5vw, 2.8rem)", color: "#1a1a1a" }}
            >
              From the soil to your table.
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                Icon: Leaf,
                title: "Know your farmer",
                body: "Every farm on HomeGrown has a profile with their story, their practices, and their land. You know exactly where your food comes from.",
              },
              {
                Icon: Package,
                title: "Flexible subscriptions",
                body: "Weekly, biweekly, or monthly. Pause whenever life gets busy. Cancel anytime. Your schedule, your terms.",
              },
              {
                Icon: Handshake,
                title: "Fair for everyone",
                body: "Farmers keep more of what they earn. You pay less than specialty grocery. No middlemen, no markups.",
              },
            ].map((v) => (
              <div
                key={v.title}
                className="rounded-2xl p-8 text-center transition-all duration-300 hover:-translate-y-1"
                style={{
                  background: "#ffffff",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.07)",
                }}
              >
                <div
                  className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-5"
                  style={{ backgroundColor: "#FDF3E3" }}
                >
                  <v.Icon className="w-7 h-7" style={{ color: "#2D5016" }} />
                </div>
                <h3
                  className="font-heading font-bold text-lg mb-3"
                  style={{ color: "#1a1a1a" }}
                >
                  {v.title}
                </h3>
                <p className="text-sm leading-relaxed" style={{ color: "#6b6b6b" }}>
                  {v.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── HOW IT WORKS ─────────────────────── */}
      <section
        className="py-24 border-y"
        style={{ backgroundColor: "#ffffff", borderColor: "#e8e2d9" }}
      >
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <span
              className="text-xs font-bold tracking-[0.12em] uppercase"
              style={{ color: "#C4622D" }}
            >
              How it works
            </span>
            <h2
              className="font-heading font-bold mt-2"
              style={{ fontSize: "clamp(1.8rem, 3.5vw, 2.8rem)", color: "#1a1a1a" }}
            >
              Fresh food in three steps.
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8 text-center">
            {[
              {
                num: "01",
                Icon: Map,
                title: "Browse local farms",
                body: "Search farms near you. Read their story, see their practices, explore what they grow.",
              },
              {
                num: "02",
                Icon: ShoppingBag,
                title: "Pick a plan",
                body: "Choose a weekly veggie box, a monthly meat share, or whatever fits your household.",
              },
              {
                num: "03",
                Icon: Truck,
                title: "Get deliveries",
                body: "Your farmer prepares your box and delivers it on schedule. Pause or cancel any time.",
              },
            ].map((s) => (
              <div key={s.num} className="px-4">
                <p
                  className="font-heading font-bold mb-4 opacity-70"
                  style={{ fontSize: "3.5rem", color: "#D4A96A", lineHeight: 1 }}
                >
                  {s.num}
                </p>
                <div
                  className="w-16 h-16 rounded-xl flex items-center justify-center mx-auto mb-5"
                  style={{ backgroundColor: "#2D5016" }}
                >
                  <s.Icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="font-heading font-bold text-lg mb-2" style={{ color: "#1a1a1a" }}>
                  {s.title}
                </h3>
                <p className="text-sm leading-relaxed" style={{ color: "#6b6b6b" }}>
                  {s.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── NEWSLETTER ───────────────────────── */}
      <section className="py-24" style={{ backgroundColor: "#2D5016" }}>
        <div className="max-w-6xl mx-auto px-6">
          <div className="max-w-2xl mx-auto text-center">
            <span
              className="text-xs font-bold tracking-[0.12em] uppercase"
              style={{ color: "#D4A96A" }}
            >
              Stay in the loop
            </span>
            <h2
              className="font-heading font-bold mt-2 mb-3"
              style={{ fontSize: "clamp(2rem, 4vw, 3rem)", color: "#ffffff" }}
            >
              From the farm, to your inbox.
            </h2>
            <p className="mb-8 leading-relaxed" style={{ color: "rgba(255,255,255,0.75)" }}>
              Seasonal finds, farm stories, and early access to new products.
            </p>

            <form
              onSubmit={handleWaitlist}
              className="flex gap-2 justify-center flex-wrap"
            >
              <input
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="rounded-full px-5 py-3 text-sm outline-none w-72"
                style={{
                  background: "rgba(255,255,255,0.12)",
                  border: "1.5px solid rgba(255,255,255,0.25)",
                  color: "#ffffff",
                }}
              />
              <Button
                type="submit"
                disabled={submitting}
                className="rounded-full px-7 font-semibold border-0"
                style={{ backgroundColor: "#D4A96A", color: "#1e3a0e" }}
              >
                {submitting ? "Joining…" : "Subscribe"}
              </Button>
            </form>
            <p className="mt-4 text-xs" style={{ color: "rgba(255,255,255,0.45)" }}>
              No spam. Unsubscribe anytime. We only send things worth reading.
            </p>
          </div>
        </div>
      </section>

      {/* ─── FARMER CTA ───────────────────────── */}
      <section className="py-24" style={{ backgroundColor: "#FAF7F2" }}>
        <div className="max-w-6xl mx-auto px-6">
          <div className="max-w-xl">
            <span
              className="text-xs font-bold tracking-[0.12em] uppercase"
              style={{ color: "#C4622D" }}
            >
              For farmers
            </span>
            <h2
              className="font-heading font-bold mt-2 mb-4 leading-tight"
              style={{ fontSize: "clamp(1.8rem, 3.5vw, 2.8rem)", color: "#1a1a1a" }}
            >
              Grow your community,<br />not just your crops.
            </h2>
            <p className="mb-8 leading-relaxed" style={{ color: "#6b6b6b" }}>
              List your farm, set up subscription plans, and start building
              direct relationships with customers who value what you do.
              Free to join. No commission until you&apos;re ready.
            </p>
            <Link href="/register?role=Farmer">
              <Button
                size="lg"
                className="rounded-full px-8 font-semibold border-0 transition-all duration-300 hover:-translate-y-0.5"
                style={{
                  backgroundColor: "#2D5016",
                  color: "#ffffff",
                  boxShadow: "0 6px 20px rgba(45,80,22,0.35)",
                }}
              >
                List your farm
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* ─── FOOTER ───────────────────────────── */}
      <footer style={{ backgroundColor: "#1a2e0a", color: "rgba(250,247,242,0.75)" }}>
        <div className="max-w-6xl mx-auto px-6 pt-16 pb-0">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-12">
            {/* Brand col */}
            <div className="md:col-span-2">
              <div className="flex items-center gap-2.5 mb-3">
                <svg width="24" height="24" viewBox="0 0 28 28" fill="none">
                  <path d="M14 3C14 3 5 9 5 17C5 21.418 9.134 25 14 25C18.866 25 23 21.418 23 17C23 9 14 3 14 3Z" fill="#87A878"/>
                  <path d="M14 8C14 8 9 12 9 17C9 19.761 11.239 22 14 22C16.761 22 19 19.761 19 17C19 12 14 8 14 8Z" fill="#FAF7F2" opacity="0.5"/>
                </svg>
                <span className="font-heading text-xl font-bold" style={{ color: "#FAF7F2" }}>HomeGrown</span>
              </div>
              <p className="font-heading italic mb-2" style={{ color: "#D4A96A", fontSize: "1rem" }}>
                From the soil to your table.
              </p>
              <p className="text-sm leading-relaxed max-w-xs">
                Connecting local farmers and artisans with communities who care about where their food comes from.
              </p>
            </div>

            {/* Explore col */}
            <div>
              <h6
                className="text-xs font-bold tracking-[0.1em] uppercase mb-4"
                style={{ color: "#FAF7F2" }}
              >
                Explore
              </h6>
              <ul className="space-y-2 text-sm">
                {[
                  { label: "Browse Farms", href: "/farms" },
                  { label: "Sign In", href: "/login" },
                  { label: "Sell on HomeGrown", href: "/register?role=Farmer" },
                  { label: "My Subscriptions", href: "/my-subscriptions" },
                ].map((l) => (
                  <li key={l.label}>
                    <Link
                      href={l.href}
                      className="transition-colors hover:text-[#D4A96A]"
                      style={{ color: "rgba(250,247,242,0.65)" }}
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Newsletter col */}
            <div>
              <h6
                className="text-xs font-bold tracking-[0.1em] uppercase mb-4"
                style={{ color: "#FAF7F2" }}
              >
                Stay in the Loop
              </h6>
              <p className="text-sm mb-3 leading-relaxed">
                Seasonal picks, farm stories, and recipes — delivered weekly.
              </p>
              <form onSubmit={handleWaitlist} className="flex gap-2">
                <input
                  type="email"
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="rounded-full flex-1 px-4 py-2 text-sm outline-none min-w-0"
                  style={{
                    background: "rgba(255,255,255,0.08)",
                    border: "1.5px solid rgba(255,255,255,0.15)",
                    color: "#ffffff",
                  }}
                />
                <button
                  type="submit"
                  disabled={submitting}
                  className="rounded-full px-4 py-2 text-sm font-semibold shrink-0"
                  style={{ backgroundColor: "#D4A96A", color: "#1e3a0e" }}
                >
                  Go
                </button>
              </form>
            </div>
          </div>
        </div>

        <div
          className="border-t"
          style={{ borderColor: "rgba(255,255,255,0.08)" }}
        >
          <div className="max-w-6xl mx-auto px-6 py-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <p className="text-xs" style={{ color: "rgba(250,247,242,0.4)" }}>
              © 2026 HomeGrown. All rights reserved. Made with care for local food systems.
            </p>
            <div className="flex gap-5">
              {["Privacy Policy", "Terms of Service"].map((l) => (
                <a
                  key={l}
                  href="#"
                  className="text-xs transition-colors hover:text-[rgba(250,247,242,0.7)]"
                  style={{ color: "rgba(250,247,242,0.4)" }}
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
