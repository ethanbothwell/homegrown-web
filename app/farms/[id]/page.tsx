"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Nav } from "@/components/nav";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { farms as farmsApi, checkout, Farm, SubscriptionPlan } from "@/lib/api";
import { useAuth } from "@/lib/auth-context";
import { toast } from "sonner";
import { MapPin, Loader2 } from "lucide-react";

const frequencyLabel: Record<string, string> = {
  Weekly: "Weekly delivery",
  Biweekly: "Every two weeks",
  Monthly: "Monthly delivery",
};

const frequencyShort: Record<string, string> = {
  Weekly: "/ week",
  Biweekly: "/ 2 wks",
  Monthly: "/ month",
};

export default function FarmDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { user } = useAuth();
  const [farm, setFarm] = useState<Farm | null>(null);
  const [loading, setLoading] = useState(true);
  const [subscribing, setSubscribing] = useState<string | null>(null);

  useEffect(() => {
    farmsApi
      .get(id)
      .then(setFarm)
      .catch(() => toast.error("Farm not found."))
      .finally(() => setLoading(false));
  }, [id]);

  async function handleSubscribe(plan: SubscriptionPlan) {
    if (!user) {
      router.push(`/register?role=Buyer`);
      return;
    }
    if (user.role !== "Buyer") {
      toast.error("Only buyers can subscribe to plans.");
      return;
    }
    setSubscribing(plan.id);
    try {
      const origin = window.location.origin;
      const { url } = await checkout.createSession(
        plan.id,
        `${origin}/my-subscriptions?success=true`,
        `${origin}/farms/${id}`
      );
      window.location.href = url;
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to start checkout.");
      setSubscribing(null);
    }
  }

  if (loading) {
    return (
      <>
        <Nav />
        <div className="flex items-center justify-center py-32">
          <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
        </div>
      </>
    );
  }

  if (!farm) {
    return (
      <>
        <Nav />
        <div className="text-center py-32 text-muted-foreground text-sm">Farm not found.</div>
      </>
    );
  }

  const activePlans = (farm.subscriptionPlans ?? []).filter((p) => p.isActive);

  return (
    <>
      <Nav />
      <main className="max-w-4xl mx-auto px-6 py-14">

        {/* Farm header */}
        {farm.imageUrl && (
          <div className="h-64 md:h-80 rounded-xl overflow-hidden mb-10">
            <img src={farm.imageUrl} alt={farm.name} className="w-full h-full object-cover" />
          </div>
        )}

        <div className="mb-10">
          <h1 className="font-heading text-4xl md:text-5xl font-bold text-foreground mb-2">
            {farm.name}
          </h1>
          {farm.location && (
            <p className="text-muted-foreground flex items-center gap-1.5 text-sm">
              <MapPin className="h-3.5 w-3.5" />
              {farm.location}
            </p>
          )}
        </div>

        {farm.bio && (
          <p className="text-foreground/80 text-base leading-relaxed mb-8 max-w-2xl">
            {farm.bio}
          </p>
        )}

        {(farm.practices ?? []).length > 0 && (
          <div className="flex flex-wrap gap-2 mb-12">
            {farm.practices.map((p) => (
              <Badge key={p.id} variant="secondary" className="rounded-full px-3 font-normal">
                {p.name}
              </Badge>
            ))}
          </div>
        )}

        <Separator className="mb-12" />

        {/* Subscription plans */}
        <div>
          <div className="mb-8">
            <p className="text-xs font-semibold tracking-widest uppercase text-muted-foreground mb-2">
              Subscription plans
            </p>
            <h2 className="font-heading text-2xl font-bold text-foreground">
              Choose how you&apos;d like to receive your deliveries.
            </h2>
          </div>

          {activePlans.length === 0 && (
            <p className="text-muted-foreground text-sm">
              No active plans right now — check back soon.
            </p>
          )}

          <div className="grid sm:grid-cols-2 gap-4">
            {activePlans.map((plan) => (
              <div
                key={plan.id}
                className="bg-card border border-border rounded-xl p-6 flex flex-col gap-4"
              >
                <div>
                  <h3 className="font-heading font-semibold text-lg text-foreground mb-1">
                    {plan.name}
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    {frequencyLabel[plan.frequency]}
                  </p>
                </div>

                {plan.description && (
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {plan.description}
                  </p>
                )}

                <div className="mt-auto flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
                  <div>
                    <span className="font-heading text-3xl font-bold text-foreground">
                      ${plan.price.toFixed(0)}
                    </span>
                    <span className="text-sm text-muted-foreground ml-1">
                      {frequencyShort[plan.frequency]}
                    </span>
                  </div>
                  <Button
                    onClick={() => handleSubscribe(plan)}
                    disabled={subscribing === plan.id}
                    className="w-full sm:w-auto bg-primary text-primary-foreground hover:bg-primary/90 rounded-full px-6"
                  >
                    {subscribing === plan.id ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : user ? (
                      "Subscribe"
                    ) : (
                      "Sign up to subscribe"
                    )}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </>
  );
}
