"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Nav } from "@/components/nav";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { mySubscriptions, FarmSubscription } from "@/lib/api";
import { useAuth } from "@/lib/auth-context";
import { toast } from "sonner";
import { Loader2, Calendar, Pause, X } from "lucide-react";

const statusColor: Record<string, string> = {
  Active: "bg-green-100 text-green-800",
  Paused: "bg-yellow-100 text-yellow-800",
  Cancelled: "bg-gray-100 text-gray-500",
};

const frequencyLabel: Record<string, string> = {
  Weekly: "Weekly",
  Biweekly: "Every 2 weeks",
  Monthly: "Monthly",
};

export default function MySubscriptionsPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [subs, setSubs] = useState<FarmSubscription[]>([]);
  const [loading, setLoading] = useState(true);
  const [acting, setActing] = useState<string | null>(null);

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
    if (!confirm("Cancel this subscription? This cannot be undone.")) return;
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
    <>
      <Nav />
      <main className="max-w-3xl mx-auto px-4 py-10">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">My Subscriptions</h1>
        <p className="text-gray-500 mb-8">Manage your farm deliveries.</p>

        {(loading || authLoading) && (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="h-6 w-6 animate-spin text-green-600" />
          </div>
        )}

        {!loading && subs.length === 0 && (
          <div className="text-center py-20">
            <p className="text-gray-500 mb-4">You haven&apos;t subscribed to any plans yet.</p>
            <Button
              onClick={() => router.push("/farms")}
              className="bg-green-700 hover:bg-green-800 text-white"
            >
              Browse farms
            </Button>
          </div>
        )}

        <div className="space-y-4">
          {subs.map((sub) => (
            <Card key={sub.id}>
              <CardHeader className="pb-2">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <CardTitle className="text-base">{sub.planName}</CardTitle>
                    <CardDescription>{sub.farmName}</CardDescription>
                  </div>
                  <Badge className={statusColor[sub.status]}>{sub.status}</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-3 text-sm text-gray-600 mb-4">
                  <div className="flex items-center gap-1.5">
                    <Calendar className="h-4 w-4 text-gray-400" />
                    {frequencyLabel[sub.frequency]}
                  </div>
                  <div>
                    <span className="font-medium text-gray-900">${sub.price.toFixed(2)}</span>
                    <span className="text-gray-500"> per delivery</span>
                  </div>
                  <div className="col-span-2 text-xs text-gray-400">
                    Next delivery:{" "}
                    {new Date(sub.nextDeliveryDate).toLocaleDateString("en-US", {
                      weekday: "long",
                      month: "long",
                      day: "numeric",
                    })}
                  </div>
                </div>

                {sub.status !== "Cancelled" && (
                  <div className="flex gap-2">
                    {sub.status === "Active" && (
                      <Button
                        size="sm"
                        variant="outline"
                        disabled={acting === sub.id}
                        onClick={() => pause(sub.id)}
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
                      className="text-red-600 hover:text-red-700 hover:border-red-300"
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
              </CardContent>
            </Card>
          ))}
        </div>
      </main>
    </>
  );
}
