"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Nav } from "@/components/nav";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { farms as farmsApi, subscriptionPlans, Farm, SubscriptionPlan } from "@/lib/api";
import { useAuth } from "@/lib/auth-context";
import { toast } from "sonner";
import { MapPin, Loader2, Calendar } from "lucide-react";

const frequencyLabel: Record<string, string> = {
  Weekly: "Weekly",
  Biweekly: "Every 2 weeks",
  Monthly: "Monthly",
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
      await subscriptionPlans.subscribe(plan.id, {});
      toast.success(`Subscribed to ${plan.name}!`);
      router.push("/my-subscriptions");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to subscribe.");
    } finally {
      setSubscribing(null);
    }
  }

  if (loading) {
    return (
      <>
        <Nav />
        <div className="flex items-center justify-center py-32">
          <Loader2 className="h-6 w-6 animate-spin text-green-600" />
        </div>
      </>
    );
  }

  if (!farm) {
    return (
      <>
        <Nav />
        <div className="text-center py-32 text-gray-500">Farm not found.</div>
      </>
    );
  }

  const activePlans = farm.subscriptionPlans?.filter((p) => p.isActive) ?? [];

  return (
    <>
      <Nav />
      <main className="max-w-4xl mx-auto px-4 py-10">
        {/* Header */}
        {farm.imageUrl && (
          <div className="h-56 rounded-xl overflow-hidden mb-8">
            <img src={farm.imageUrl} alt={farm.name} className="w-full h-full object-cover" />
          </div>
        )}

        <div className="mb-2">
          <h1 className="text-3xl font-bold text-gray-900">{farm.name}</h1>
          {farm.location && (
            <p className="text-gray-500 flex items-center gap-1 mt-1">
              <MapPin className="h-4 w-4" />
              {farm.location}
            </p>
          )}
        </div>

        {farm.bio && (
          <p className="text-gray-700 mt-3 mb-4 leading-relaxed">{farm.bio}</p>
        )}

        {farm.practices.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-8">
            {farm.practices.map((p) => (
              <Badge key={p.id} variant="secondary">{p.name}</Badge>
            ))}
          </div>
        )}

        <Separator className="my-8" />

        {/* Subscription Plans */}
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-1">Subscription Plans</h2>
          <p className="text-gray-500 text-sm mb-6">
            Subscribe to receive regular deliveries from this farm.
          </p>

          {activePlans.length === 0 && (
            <p className="text-gray-500">No active plans right now. Check back soon!</p>
          )}

          <div className="grid sm:grid-cols-2 gap-4">
            {activePlans.map((plan) => (
              <Card key={plan.id}>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">{plan.name}</CardTitle>
                  <CardDescription className="flex items-center gap-1 text-xs">
                    <Calendar className="h-3.5 w-3.5" />
                    {frequencyLabel[plan.frequency]}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {plan.description && (
                    <p className="text-sm text-gray-600 mb-3">{plan.description}</p>
                  )}
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-2xl font-bold text-gray-900">
                      ${plan.price.toFixed(2)}
                      <span className="text-sm font-normal text-gray-500 ml-1">
                        /{plan.frequency === "Weekly" ? "wk" : plan.frequency === "Biweekly" ? "2wks" : "mo"}
                      </span>
                    </span>
                    <Button
                      onClick={() => handleSubscribe(plan)}
                      disabled={subscribing === plan.id}
                      className="bg-green-700 hover:bg-green-800 text-white"
                      size="sm"
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
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </main>
    </>
  );
}
