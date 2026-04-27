"use client";

import { useState } from "react";
import Link from "next/link";
import { Nav } from "@/components/nav";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { newsletter } from "@/lib/api";
import { toast } from "sonner";

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

      {/* Hero */}
      <section
        className="relative flex items-center justify-center text-center"
        style={{
          minHeight: "72vh",
          background: "linear-gradient(135deg, #2D5016 0%, #3d6b1f 40%, #1e3a0e 100%)",
        }}
      >
        {/* subtle texture overlay */}
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage:
              "radial-gradient(circle at 20% 50%, #87A878 0%, transparent 50%), radial-gradient(circle at 80% 20%, #C4622D 0%, transparent 40%)",
          }}
        />

        <div className="relative max-w-3xl mx-auto px-6 py-28">
          <p
            className="text-xs font-semibold tracking-widest uppercase mb-5"
            style={{ color: "rgba(212,169,106,0.9)" }}
          >
            Local. Seasonal. Real.
          </p>
          <h1
            className="font-heading text-5xl md:text-6xl lg:text-7xl font-bold leading-[1.08] mb-6"
            style={{ color: "#FAF7F2" }}
          >
            Know Your Farmer.<br />Love Your Food.
          </h1>
          <p
            className="text-lg leading-relaxed mb-10 max-w-xl mx-auto"
            style={{ color: "rgba(250,247,242,0.75)" }}
          >
            Fresh, local, and grown with intention.<br />
            Direct from small farms to your table.
          </p>

          <div className="flex flex-wrap gap-3 justify-center">
            <Link href="/farms">
              <Button
                size="lg"
                className="rounded-full px-8 font-semibold text-base"
                style={{ backgroundColor: "#C4622D", color: "#FAF7F2" }}
              >
                Browse Farms
              </Button>
            </Link>
            <Link href="/register">
              <Button
                size="lg"
                variant="outline"
                className="rounded-full px-8 font-semibold text-base border-2 bg-transparent hover:bg-white/10"
                style={{ borderColor: "rgba(250,247,242,0.6)", color: "#FAF7F2" }}
              >
                Join Free
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Values strip */}
      <section className="bg-background py-24 border-b border-border">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid md:grid-cols-3 gap-16">
            {[
              {
                num: "01",
                title: "Know your farmer",
                body: "Every farm on HomeGrown has a profile with their story, their practices, and their land. You know exactly where your food comes from.",
              },
              {
                num: "02",
                title: "Flexible subscriptions",
                body: "Weekly, biweekly, or monthly. Pause whenever life gets busy. Cancel anytime. Your schedule, your terms.",
              },
              {
                num: "03",
                title: "Fair for everyone",
                body: "Farmers keep more of what they earn. You pay less than specialty grocery. No middlemen, no markups.",
              },
            ].map((f) => (
              <div key={f.num}>
                <p className="text-xs font-semibold tracking-widest uppercase text-muted-foreground mb-4">
                  {f.num}
                </p>
                <h3 className="font-heading text-xl font-semibold text-foreground mb-3">{f.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{f.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="bg-muted/50 py-24 border-b border-border">
        <div className="max-w-6xl mx-auto px-6">
          <div className="mb-14">
            <p className="text-xs font-semibold tracking-widest uppercase text-muted-foreground mb-3">
              How it works
            </p>
            <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground">
              Fresh food in three steps.
            </h2>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                step: "1",
                title: "Browse local farms",
                body: "Search farms near you. Read their story, see their practices, explore what they grow.",
              },
              {
                step: "2",
                title: "Pick a plan",
                body: "Choose a weekly veggie box, a monthly meat share, or whatever fits your household.",
              },
              {
                step: "3",
                title: "Get deliveries",
                body: "Your farmer prepares your box and delivers it on schedule. Pause or cancel any time.",
              },
            ].map((s) => (
              <div key={s.step} className="bg-card rounded-xl p-8 border border-border">
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center mb-5"
                  style={{ backgroundColor: "rgba(196,98,45,0.1)" }}
                >
                  <span className="text-xs font-bold" style={{ color: "#C4622D" }}>
                    {s.step}
                  </span>
                </div>
                <h3 className="font-semibold text-foreground mb-2">{s.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{s.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter — forest green section */}
      <section
        className="py-24"
        style={{ backgroundColor: "#2D5016" }}
      >
        <div className="max-w-6xl mx-auto px-6">
          <div className="max-w-xl mx-auto text-center">
            <p
              className="text-xs font-semibold tracking-widest uppercase mb-4"
              style={{ color: "rgba(212,169,106,0.9)" }}
            >
              Stay in the loop
            </p>
            <h2
              className="font-heading text-3xl md:text-4xl font-bold mb-4 leading-tight"
              style={{ color: "#FAF7F2" }}
            >
              From the farm, to your inbox.
            </h2>
            <p className="mb-8 leading-relaxed" style={{ color: "rgba(250,247,242,0.7)" }}>
              Seasonal finds, farm stories, and early access. No spam.
            </p>

            <form onSubmit={handleWaitlist} className="flex gap-2 max-w-sm mx-auto">
              <Input
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="border-white/20 text-foreground"
                style={{ backgroundColor: "rgba(250,247,242,0.1)", color: "#FAF7F2" }}
              />
              <Button
                type="submit"
                disabled={submitting}
                className="whitespace-nowrap rounded-full px-6 font-semibold"
                style={{ backgroundColor: "#D4A96A", color: "#1e3a0e" }}
              >
                {submitting ? "Joining…" : "Subscribe"}
              </Button>
            </form>
          </div>
        </div>
      </section>

      {/* Farmer CTA */}
      <section className="bg-background py-24 border-t border-border">
        <div className="max-w-6xl mx-auto px-6">
          <div className="max-w-xl">
            <p className="text-xs font-semibold tracking-widest uppercase text-muted-foreground mb-4">
              For farmers
            </p>
            <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground mb-4 leading-tight">
              Grow your community,<br />not just your crops.
            </h2>
            <p className="text-muted-foreground mb-8 leading-relaxed">
              List your farm, set up subscription plans, and start building direct
              relationships with customers who value what you do. Free to join.
            </p>
            <Link href="/register?role=Farmer">
              <Button
                size="lg"
                className="rounded-full px-8 font-semibold"
                style={{ backgroundColor: "#2D5016", color: "#FAF7F2" }}
              >
                List your farm
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <footer style={{ backgroundColor: "#1e3a0e" }} className="py-10">
        <div className="max-w-6xl mx-auto px-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <svg width="20" height="20" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M14 3C14 3 5 9 5 17C5 21.418 9.134 25 14 25C18.866 25 23 21.418 23 17C23 9 14 3 14 3Z" fill="#87A878"/>
              <path d="M14 8C14 8 9 12 9 17C9 19.761 11.239 22 14 22C16.761 22 19 19.761 19 17C19 12 14 8 14 8Z" fill="#FAF7F2" opacity="0.5"/>
            </svg>
            <span className="font-heading font-bold" style={{ color: "#FAF7F2" }}>HomeGrown</span>
          </div>
          <p className="text-sm" style={{ color: "rgba(250,247,242,0.5)" }}>
            © 2026 HomeGrown. From the soil to your table.
          </p>
        </div>
      </footer>
    </>
  );
}
