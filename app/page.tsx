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
      <section className="flex-1 bg-background">
        <div className="max-w-6xl mx-auto px-6 py-28 md:py-36">
          <div className="max-w-2xl">
            <p className="text-xs font-semibold tracking-widest uppercase text-muted-foreground mb-6">
              Farm-to-door delivery
            </p>
            <h1 className="font-heading text-5xl md:text-6xl lg:text-7xl font-bold text-foreground leading-[1.08] mb-6">
              From the field<br />
              to your table.
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed mb-10 max-w-lg">
              Subscribe to weekly boxes from small farms in your region.
              Seasonal produce, pasture-raised meat, fresh eggs — sourced from
              farmers you can actually meet.
            </p>

            <form onSubmit={handleWaitlist} className="flex gap-2 max-w-sm mb-5">
              <Input
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="bg-card border-border"
              />
              <Button
                type="submit"
                disabled={submitting}
                className="bg-primary text-primary-foreground hover:bg-primary/90 whitespace-nowrap rounded-full px-6"
              >
                {submitting ? "Joining…" : "Join waitlist"}
              </Button>
            </form>

            <p className="text-sm text-muted-foreground">
              Already have an account?{" "}
              <Link href="/login" className="text-foreground underline underline-offset-4 hover:text-primary">
                Sign in
              </Link>
              {" · "}
              <Link href="/farms" className="text-foreground underline underline-offset-4 hover:text-primary">
                Browse farms
              </Link>
            </p>
          </div>
        </div>

        {/* Thin rule */}
        <div className="max-w-6xl mx-auto px-6">
          <div className="border-t border-border" />
        </div>
      </section>

      {/* Values */}
      <section className="bg-background py-24">
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
                <h3 className="font-heading text-xl font-semibold text-foreground mb-3">
                  {f.title}
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{f.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="bg-muted/50 py-24 border-y border-border">
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
              { step: "1", title: "Browse local farms", body: "Search farms near you. Read their story, see their practices, explore what they grow." },
              { step: "2", title: "Pick a plan", body: "Choose a weekly veggie box, a monthly meat share, or whatever fits your household. Prices start at $20." },
              { step: "3", title: "Get deliveries", body: "Your farmer prepares your box and delivers it on schedule. Adjust, pause, or cancel any time." },
            ].map((s) => (
              <div key={s.step} className="bg-card rounded-xl p-8 border border-border">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center mb-5">
                  <span className="text-xs font-bold text-primary">{s.step}</span>
                </div>
                <h3 className="font-semibold text-foreground mb-2">{s.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{s.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Farmer CTA */}
      <section className="bg-primary py-24">
        <div className="max-w-6xl mx-auto px-6">
          <div className="max-w-xl">
            <p className="text-xs font-semibold tracking-widest uppercase text-primary-foreground/60 mb-4">
              For farmers
            </p>
            <h2 className="font-heading text-3xl md:text-4xl font-bold text-primary-foreground mb-4 leading-tight">
              Grow your community,<br />not just your crops.
            </h2>
            <p className="text-primary-foreground/70 mb-8 leading-relaxed">
              List your farm, set up subscription plans, and start building a
              direct relationship with customers who value what you do. Free to
              join. No commission until you're ready.
            </p>
            <Link href="/register?role=Farmer">
              <Button
                size="lg"
                className="bg-primary-foreground text-primary hover:bg-primary-foreground/90 rounded-full px-8 font-semibold"
              >
                List your farm
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <footer className="bg-foreground text-primary-foreground/50 py-10">
        <div className="max-w-6xl mx-auto px-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <span className="font-heading text-primary-foreground font-semibold">HomeGrown</span>
          <p className="text-sm">© 2026 HomeGrown. Supporting local agriculture.</p>
        </div>
      </footer>
    </>
  );
}
