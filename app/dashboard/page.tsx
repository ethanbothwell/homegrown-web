"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Nav } from "@/components/nav";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { farms as farmsApi, subscriptionPlans as plansApi, Farm, SubscriptionPlan } from "@/lib/api";
import { useAuth } from "@/lib/auth-context";
import { toast } from "sonner";
import { Loader2, Plus, Trash2, X } from "lucide-react";

type Frequency = "Weekly" | "Biweekly" | "Monthly";

export default function DashboardPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();

  const [farm, setFarm] = useState<Farm | null>(null);
  const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
  const [loading, setLoading] = useState(true);

  const [editingFarm, setEditingFarm] = useState(false);
  const [farmName, setFarmName] = useState("");
  const [farmDesc, setFarmDesc] = useState("");
  const [farmLocation, setFarmLocation] = useState("");
  const [farmImage, setFarmImage] = useState("");
  const [savingFarm, setSavingFarm] = useState(false);

  const [newPractice, setNewPractice] = useState("");
  const [addingPractice, setAddingPractice] = useState(false);

  const [showPlanForm, setShowPlanForm] = useState(false);
  const [planName, setPlanName] = useState("");
  const [planDesc, setPlanDesc] = useState("");
  const [planPrice, setPlanPrice] = useState("");
  const [planFreq, setPlanFreq] = useState<Frequency>("Weekly");
  const [planMax, setPlanMax] = useState("");
  const [savingPlan, setSavingPlan] = useState(false);

  useEffect(() => {
    if (authLoading) return;
    if (!user || user.role !== "Farmer") {
      router.replace("/login");
      return;
    }
    farmsApi
      .getMine()
      .then((f) => {
        setFarm(f);
        setPlans(f.subscriptionPlans ?? []);
        setFarmName(f.name);
        setFarmDesc(f.bio ?? "");
        setFarmLocation(f.location ?? "");
        setFarmImage(f.imageUrl ?? "");
      })
      .catch(() => setEditingFarm(true))
      .finally(() => setLoading(false));
  }, [user, authLoading, router]);

  async function saveFarm(e: React.SyntheticEvent<HTMLFormElement>) {
    e.preventDefault();
    setSavingFarm(true);
    try {
      const data = {
        name: farmName,
        bio: farmDesc || undefined,
        location: farmLocation || undefined,
        imageUrl: farmImage || undefined,
      };
      if (farm) {
        const updated = await farmsApi.update(farm.id, data);
        setFarm(updated);
        toast.success("Farm profile updated.");
      } else {
        const created = await farmsApi.create(data);
        setFarm(created);
        setPlans([]);
        toast.success("Farm created.");
      }
      setEditingFarm(false);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to save farm.");
    } finally {
      setSavingFarm(false);
    }
  }

  async function addPractice(e: React.SyntheticEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!farm || !newPractice.trim()) return;
    setAddingPractice(true);
    try {
      const practice = await farmsApi.addPractice(farm.id, newPractice.trim());
      setFarm((prev) =>
        prev ? { ...prev, practices: [...prev.practices, practice] } : prev
      );
      setNewPractice("");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to add practice.");
    } finally {
      setAddingPractice(false);
    }
  }

  async function removePractice(practiceId: string) {
    if (!farm) return;
    try {
      await farmsApi.removePractice(farm.id, practiceId);
      setFarm((prev) =>
        prev ? { ...prev, practices: prev.practices.filter((p) => p.id !== practiceId) } : prev
      );
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to remove practice.");
    }
  }

  async function createPlan(e: React.SyntheticEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!farm) return;
    setSavingPlan(true);
    try {
      const plan = await plansApi.create(farm.id, {
        name: planName,
        description: planDesc || undefined,
        price: parseFloat(planPrice),
        frequency: planFreq,
        maxSubscribers: planMax ? parseInt(planMax) : undefined,
      });
      setPlans((prev) => [...prev, plan]);
      setPlanName(""); setPlanDesc(""); setPlanPrice(""); setPlanMax("");
      setShowPlanForm(false);
      toast.success("Plan created.");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to create plan.");
    } finally {
      setSavingPlan(false);
    }
  }

  async function deactivatePlan(id: string) {
    if (!confirm("Deactivate this plan?")) return;
    try {
      await plansApi.deactivate(id);
      setPlans((prev) => prev.map((p) => (p.id === id ? { ...p, isActive: false } : p)));
      toast.success("Plan deactivated.");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed.");
    }
  }

  if (authLoading || loading) {
    return (
      <>
        <Nav />
        <div className="flex items-center justify-center py-32">
          <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
        </div>
      </>
    );
  }

  return (
    <>
      <Nav />
      <main className="max-w-3xl mx-auto px-6 py-14 space-y-14">

        <div>
          <p className="text-xs font-semibold tracking-widest uppercase text-muted-foreground mb-3">
            Farmer dashboard
          </p>
          <h1 className="font-heading text-4xl font-bold text-foreground">
            {farm ? farm.name : "Set up your farm"}
          </h1>
        </div>

        {/* Farm Profile */}
        <section>
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-heading text-xl font-semibold text-foreground">Farm profile</h2>
            {farm && !editingFarm && (
              <Button variant="outline" size="sm" onClick={() => setEditingFarm(true)}>
                Edit
              </Button>
            )}
          </div>

          {editingFarm ? (
            <form onSubmit={saveFarm} className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="fname">Farm name *</Label>
                <Input id="fname" value={farmName} onChange={(e) => setFarmName(e.target.value)} required className="bg-card" />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="fdesc">Description</Label>
                <textarea
                  id="fdesc"
                  value={farmDesc}
                  onChange={(e) => setFarmDesc(e.target.value)}
                  rows={3}
                  className="w-full rounded-lg border border-input bg-card px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring resize-none"
                  placeholder="Tell customers about your farm…"
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="floc">Location</Label>
                  <Input id="floc" value={farmLocation} onChange={(e) => setFarmLocation(e.target.value)} placeholder="e.g. Sonoma, CA" className="bg-card" />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="fimg">Image URL</Label>
                  <Input id="fimg" value={farmImage} onChange={(e) => setFarmImage(e.target.value)} placeholder="https://…" className="bg-card" />
                </div>
              </div>
              <div className="flex gap-2 pt-1">
                <Button type="submit" disabled={savingFarm} className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-full px-6">
                  {savingFarm ? <Loader2 className="h-4 w-4 animate-spin" /> : farm ? "Save changes" : "Create farm"}
                </Button>
                {farm && (
                  <Button type="button" variant="ghost" onClick={() => setEditingFarm(false)}>
                    Cancel
                  </Button>
                )}
              </div>
            </form>
          ) : farm ? (
            <div className="bg-card border border-border rounded-xl p-6">
              <h3 className="font-heading font-semibold text-lg text-foreground">{farm.name}</h3>
              {farm.location && <p className="text-sm text-muted-foreground mt-0.5">{farm.location}</p>}
              {farm.bio && <p className="text-sm text-foreground/70 mt-3 leading-relaxed">{farm.bio}</p>}
            </div>
          ) : null}
        </section>

        {/* Practices */}
        {farm && (
          <section>
            <h2 className="font-heading text-xl font-semibold text-foreground mb-5">
              Farming practices
            </h2>
            <p className="text-sm text-muted-foreground mb-4">
              Tags shown on your farm page — e.g. Organic, No-Spray, Pasture-Raised.
            </p>
            <div className="flex flex-wrap gap-2 mb-4">
              {farm.practices.map((p) => (
                <span
                  key={p.id}
                  className="inline-flex items-center gap-1 bg-muted text-foreground/80 text-sm px-3 py-1 rounded-full"
                >
                  {p.name}
                  <button onClick={() => removePractice(p.id)} className="hover:text-destructive ml-0.5">
                    <X className="h-3 w-3" />
                  </button>
                </span>
              ))}
              {farm.practices.length === 0 && (
                <span className="text-sm text-muted-foreground">No practices added yet.</span>
              )}
            </div>
            <form onSubmit={addPractice} className="flex gap-2 max-w-sm">
              <Input
                value={newPractice}
                onChange={(e) => setNewPractice(e.target.value)}
                placeholder="Add a practice…"
                maxLength={100}
                className="bg-card"
              />
              <Button type="submit" size="sm" variant="outline" disabled={addingPractice || !newPractice.trim()}>
                {addingPractice ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
              </Button>
            </form>
          </section>
        )}

        {farm && <Separator />}

        {/* Subscription Plans */}
        {farm && (
          <section>
            <div className="flex items-center justify-between mb-5">
              <div>
                <h2 className="font-heading text-xl font-semibold text-foreground">Subscription plans</h2>
                <p className="text-sm text-muted-foreground mt-0.5">What buyers can subscribe to on your farm page.</p>
              </div>
              <Button
                size="sm"
                className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-full px-5"
                onClick={() => setShowPlanForm(true)}
              >
                <Plus className="h-3.5 w-3.5 mr-1.5" />
                New plan
              </Button>
            </div>

            {showPlanForm && (
              <div className="bg-card border border-border rounded-xl p-6 mb-6">
                <h3 className="font-heading font-semibold text-foreground mb-5">New plan</h3>
                <form onSubmit={createPlan} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5 sm:col-span-2">
                      <Label htmlFor="pname">Plan name *</Label>
                      <Input id="pname" value={planName} onChange={(e) => setPlanName(e.target.value)} required placeholder="e.g. Weekly Veggie Box" className="bg-background" />
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="pprice">Price (USD) *</Label>
                      <Input id="pprice" type="number" min="0.01" step="0.01" value={planPrice} onChange={(e) => setPlanPrice(e.target.value)} required placeholder="35.00" className="bg-background" />
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="pfreq">Frequency *</Label>
                      <select
                        id="pfreq"
                        value={planFreq}
                        onChange={(e) => setPlanFreq(e.target.value as Frequency)}
                        className="w-full h-9 rounded-lg border border-input bg-background px-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                      >
                        <option value="Weekly">Weekly</option>
                        <option value="Biweekly">Biweekly</option>
                        <option value="Monthly">Monthly</option>
                      </select>
                    </div>
                    <div className="space-y-1.5 sm:col-span-2">
                      <Label htmlFor="pdesc">Description</Label>
                      <Input id="pdesc" value={planDesc} onChange={(e) => setPlanDesc(e.target.value)} placeholder="What's included?" className="bg-background" />
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="pmax">Max subscribers</Label>
                      <Input id="pmax" type="number" min="1" value={planMax} onChange={(e) => setPlanMax(e.target.value)} placeholder="Unlimited" className="bg-background" />
                    </div>
                  </div>
                  <div className="flex gap-2 pt-1">
                    <Button type="submit" disabled={savingPlan} className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-full px-6">
                      {savingPlan ? <Loader2 className="h-4 w-4 animate-spin" /> : "Create plan"}
                    </Button>
                    <Button type="button" variant="ghost" onClick={() => setShowPlanForm(false)}>Cancel</Button>
                  </div>
                </form>
              </div>
            )}

            <div className="space-y-3">
              {plans.length === 0 && (
                <p className="text-sm text-muted-foreground">No plans yet. Create one above.</p>
              )}
              {plans.map((plan) => (
                <div
                  key={plan.id}
                  className={`bg-card border border-border rounded-xl px-5 py-4 flex items-center justify-between gap-4 ${!plan.isActive ? "opacity-50" : ""}`}
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-foreground">{plan.name}</span>
                      {!plan.isActive && (
                        <Badge variant="secondary" className="text-xs rounded-full">Inactive</Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground mt-0.5">
                      ${plan.price.toFixed(2)} · {plan.frequency}
                      {plan.maxSubscribers ? ` · max ${plan.maxSubscribers}` : ""}
                    </p>
                    {plan.description && (
                      <p className="text-xs text-muted-foreground mt-1">{plan.description}</p>
                    )}
                  </div>
                  {plan.isActive && (
                    <Button
                      size="sm"
                      variant="ghost"
                      className="text-muted-foreground hover:text-destructive shrink-0"
                      onClick={() => deactivatePlan(plan.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}
      </main>
    </>
  );
}
