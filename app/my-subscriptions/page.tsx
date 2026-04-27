"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Nav } from "@/components/nav";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { mySubscriptions, FarmSubscription } from "@/lib/api";
import { useAuth } from "@/lib/auth-context";
import { toast } from "sonner";
import { Loader2, Pause, X } from "lucide-react";

const statusColor: Record<string, string> = {
  Active: "bg-emerald-50 text-emerald-800 border-emerald-200",
  Paused: "bg-amber-50 text-amber-800 border-amber-200",
  Cancelled: "bg-muted text-muted-foreground border-border",
};

const frequencyLabel: Record<string, string> = {
  Weekly: "Weekly",
  Biweekly: "Every two weeks",
  Monthly: "Monthly",
};

function MySubscriptionsContent() {
  const router = useRouter();
  const params = useSearchParams();
  const { user, loading: authLoading } = useAuth();
  const [subs, setSubs] = useState<FarmSubscription[]>([]);
  const [loading, setLoading] = useState(true);
  const [acting, setActing] = useState<string | null>(null);

  useEffect(() => {
    if (params.get("success") === "true") {
      toast.success("Payment successful. Your subscription is active.");
    }
  }, [params]);

  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      router.replace("/login");
      return;
    }
    mySubscriptions
      .list()
      .then(setSubs)
      .catch((e) => toast.error(e.message))
      .finally(() => setLoading(false));
  }, [user, authLoading, router]);

  async function pause(id: string) {
    setActing(id);
    try {
      const updated = await mySubscriptions.pause(id);
      setSubs((prev) => prev.map((s) => (s.id === id ? updated : s)));
      toast.success("Subscription paused.");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed.");
    } finally {
      setActing(null);
    }
  }

  async function cancel(id: string) {
    if (!confirm("Cancel this subscription?")) return;
    setActing(id);
    try {
      const updated = await mySubscriptions.cancel(id);
      setSubs((prev) => prev.map((s) => (s.id === id ? updated : s)));
      toast.success("Subscription cancelled.");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed.");
    } finally {
      setActing(null);
    }
  }

  return (
    <main className="max-w-3xl mx-auto px-6 py-14">
      <div className="mb-12">
        <p className="text-xs font-semibold tracking-widest uppercase text-muted-foreground mb-3">
          Your deliveries
        </p>
        <h1 className="font-heading text-4xl font-bold text-foreground">My Subscriptions</h1>
      </div>

      {(loading || authLoading) && (
        <div className="flex items-center justify-center py-24">
          <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
        </div>
      )}

      {!loading && subs.length === 0 && (
        <div className="py-24 text-center">
          <p className="text-muted-foreground text-sm mb-6">
            You don&apos;t have any active subscriptions yet.
          </p>
          <Button
            onClick={() => router.push("/farms")}
            className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-full px-6"
          >
            Browse farms
          </Button>
        </div>
      )}

      <div className="space-y-4">
        {subs.map((sub) => (
          <div key={sub.id} className="bg-card border border-border rounded-xl p-6">
            <div className="flex items-start justify-between gap-4 mb-4">
              <div>
                <h2 className="font-heading font-semibold text-foreground">{sub.planName}</h2>
                <p className="text-sm text-muted-foreground mt-0.5">{sub.farmName}</p>
              </div>
              <Badge className={`text-xs rounded-full border ${statusColor[sub.status]}`}>
                {sub.status}
              </Badge>
            </div>

            <div className="grid grid-cols-2 gap-y-2 text-sm text-muted-foreground mb-5">
              <span>{frequencyLabel[sub.frequency]}</span>
              <span className="font-medium text-foreground">${sub.price.toFixed(2)} / delivery</span>
              <span className="col-span-2 text-xs">
                Next delivery:{" "}
                {new Date(sub.nextDeliveryDate).toLocaleDateString("en-US", {
                  weekday: "long",
                  month: "long",
                  day: "numeric",
                })}
              </span>
            </div>

            {sub.status !== "Cancelled" && (
              <div className="flex gap-2">
                {sub.status === "Active" && (
                  <Button
                    size="sm"
                    variant="outline"
                    disabled={acting === sub.id}
                    onClick={() => pause(sub.id)}
                    className="rounded-full px-4 text-xs"
                  >
                    {acting === sub.id ? (
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    ) : (
                      <Pause className="h-3.5 w-3.5 mr-1.5" />
                    )}
                    Pause
                  </Button>
                )}
                <Button
                  size="sm"
                  variant="outline"
                  className="rounded-full px-4 text-xs text-muted-foreground hover:text-destructive hover:border-destructive/40"
                  disabled={acting === sub.id}
                  onClick={() => cancel(sub.id)}
                >
                  {acting === sub.id ? (
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  ) : (
                    <X className="h-3.5 w-3.5 mr-1.5" />
                  )}
                  Cancel
                </Button>
              </div>
            )}
          </div>
        ))}
      </div>
    </main>
  );
}

export default function MySubscriptionsPage() {
  return (
    <>
      <Nav />
      <Suspense>
        <MySubscriptionsContent />
      </Suspense>
    </>
  );
}
