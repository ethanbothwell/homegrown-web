"use client";

import { useState } from "react";
import Link from "next/link";
import { Nav } from "@/components/nav";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { newsletter } from "@/lib/api";
import { toast } from "sonner";
import { Sprout, Leaf, Truck, Heart } from "lucide-react";

export default function HomePage() {
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleWaitlist(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!email) return;
    setSubmitting(true);
    try {
      const res = await newsletter.subscribe(email);
      if (res.duplicate) {
        toast.info("You're already on the list!");
      } else {
        toast.success("You're on the waitlist! We'll be in touch.");
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
      <section className="flex-1 bg-gradient-to-b from-green-50 to-white">
        <div className="max-w-4xl mx-auto px-4 py-24 text-center">
          <div className="inline-flex items-center gap-2 bg-green-100 text-green-800 text-sm font-medium px-3 py-1 rounded-full mb-6">
            <Sprout className="h-4 w-4" />
            Coming soon
          </div>
          <h1 className="text-5xl font-bold text-gray-900 leading-tight mb-6">
            Fresh from local farms,
            <br />
            <span className="text-green-700">delivered to your door.</span>
          </h1>
          <p className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto">
            HomeGrown connects you directly with small, local farms. Subscribe to a
            weekly veggie box, seasonal fruit share, or artisan goods — and know
            exactly where your food comes from.
          </p>

          <form onSubmit={handleWaitlist} className="flex gap-3 max-w-md mx-auto mb-6">
            <Input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="flex-1"
            />
            <Button
              type="submit"
              disabled={submitting}
              className="bg-green-700 hover:bg-green-800 text-white whitespace-nowrap"
            >
              {submitting ? "Joining…" : "Join the waitlist"}
            </Button>
          </form>

          <p className="text-sm text-gray-500">
            Already have an account?{" "}
            <Link href="/login" className="text-green-700 hover:underline">
              Sign in
            </Link>
            {" or "}
            <Link href="/farms" className="text-green-700 hover:underline">
              browse farms
            </Link>
          </p>
        </div>
      </section>

      {/* Features */}
      <section className="bg-white py-20">
        <div className="max-w-5xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Why HomeGrown?
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: <Leaf className="h-6 w-6 text-green-600" />,
                title: "Know your farmer",
                desc: "See exactly where your food is grown. Every farm has a profile with their story, practices, and photos.",
              },
              {
                icon: <Truck className="h-6 w-6 text-green-600" />,
                title: "Flexible subscriptions",
                desc: "Weekly, biweekly, or monthly deliveries. Pause or cancel any time — no lock-ins.",
              },
              {
                icon: <Heart className="h-6 w-6 text-green-600" />,
                title: "Support local",
                desc: "More of your dollar goes directly to the farmer. No supermarket markup, no middlemen.",
              },
            ].map((f) => (
              <div key={f.title} className="text-center p-6">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-green-50 mb-4">
                  {f.icon}
                </div>
                <h3 className="font-semibold text-lg text-gray-900 mb-2">{f.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA for farmers */}
      <section className="bg-green-700 py-16">
        <div className="max-w-2xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Are you a farmer?
          </h2>
          <p className="text-green-100 mb-8">
            List your farm, create subscription plans, and reach customers in your area.
            It takes less than 5 minutes to get started.
          </p>
          <Link href="/register?role=Farmer">
            <Button size="lg" className="bg-white text-green-700 hover:bg-green-50">
              List your farm for free
            </Button>
          </Link>
        </div>
      </section>

      <footer className="bg-gray-900 text-gray-400 py-8">
        <div className="max-w-6xl mx-auto px-4 text-center text-sm">
          © 2026 HomeGrown. Built with care for local agriculture.
        </div>
      </footer>
    </>
  );
}
