"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Nav } from "@/components/nav";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
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

  // Farm creation / editing
  const [editingFarm, setEditingFarm] = useState(false);
  const [farmName, setFarmName] = useState("");
  const [farmDesc, setFarmDesc] = useState("");
  const [farmLocation, setFarmLocation] = useState("");
  const [farmImage, setFarmImage] = useState("");
  const [savingFarm, setSavingFarm] = useState(false);

  // Practice tags
  const [newPractice, setNewPractice] = useState("");
  const [addingPractice, setAddingPractice] = useState(false);

  // New plan form
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
      .catch(() => {
        // No farm yet — show creation form
        setEditingFarm(true);
      })
      .finally(() => setLoading(false));
  }, [user, authLoading, router]);

  async function saveFarm(e: React.FormEvent<HTMLFormElement>) {
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
        toast.success("Farm created!");
      }
      setEditingFarm(false);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to save farm.");
    } finally {
      setSavingFarm(false);
    }
  }

  async function addPractice(e: React.FormEvent<HTMLFormElement>) {
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

  async function createPlan(e: React.FormEvent<HTMLFormElement>) {
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
      toast.success("Plan created!");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to create plan.");
    } finally {
      setSavingPlan(false);
    }
  }

  async function deactivatePlan(id: string) {
    if (!confirm("Deactivate this plan? Existing subscribers won't be affected.")) return;
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
          <Loader2 className="h-6 w-6 animate-spin text-green-600" />
        </div>
      </>
    );
  }

  return (
    <>
      <Nav />
      <main className="max-w-3xl mx-auto px-4 py-10 space-y-10">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Farmer Dashboard</h1>
          <p className="text-gray-500 mt-1">Manage your farm profile and subscription plans.</p>
        </div>

        {/* Farm Profile */}
        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Farm Profile</CardTitle>
                <CardDescription>Your public-facing farm page.</CardDescription>
              </div>
              {farm && !editingFarm && (
                <Button variant="outline" size="sm" onClick={() => setEditingFarm(true)}>
                  Edit
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent>
            {editingFarm ? (
              <form onSubmit={saveFarm} className="space-y-4">
                <div className="space-y-1.5">
                  <Label htmlFor="fname">Farm name *</Label>
                  <Input id="fname" value={farmName} onChange={(e) => setFarmName(e.target.value)} required />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="fdesc">Description</Label>
                  <textarea
                    id="fdesc"
                    value={farmDesc}
                    onChange={(e) => setFarmDesc(e.target.value)}
                    rows={3}
                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 resize-none"
                    placeholder="Tell customers about your farm…"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label htmlFor="floc">Location</Label>
                    <Input id="floc" value={farmLocation} onChange={(e) => setFarmLocation(e.target.value)} placeholder="e.g. Sonoma, CA" />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="fimg">Image URL</Label>
                    <Input id="fimg" value={farmImage} onChange={(e) => setFarmImage(e.target.value)} placeholder="https://…" />
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button type="submit" disabled={savingFarm} className="bg-green-700 hover:bg-green-800 text-white">
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
              <div>
                <h2 className="font-semibold text-gray-900">{farm.name}</h2>
                {farm.location && <p className="text-sm text-gray-500">{farm.location}</p>}
                {farm.bio && <p className="text-sm text-gray-600 mt-2">{farm.bio}</p>}
              </div>
            ) : null}
          </CardContent>
        </Card>

        {/* Practices — only visible once farm exists */}
        {farm && (
          <Card>
            <CardHeader className="pb-2">
              <CardTitle>Farming Practices</CardTitle>
              <CardDescription>Tags shown on your farm page (e.g. Organic, No-Spray).</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-wrap gap-2">
                {farm.practices.map((p) => (
                  <span key={p.id} className="inline-flex items-center gap-1 bg-gray-100 text-gray-700 text-sm px-2.5 py-1 rounded-full">
                    {p.name}
                    <button onClick={() => removePractice(p.id)} className="hover:text-red-500 ml-0.5">
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                ))}
                {farm.practices.length === 0 && (
                  <span className="text-sm text-gray-400">No practices added yet.</span>
                )}
              </div>
              <form onSubmit={addPractice} className="flex gap-2">
                <Input
                  value={newPractice}
                  onChange={(e) => setNewPractice(e.target.value)}
                  placeholder="Add a practice…"
                  maxLength={100}
                  className="flex-1"
                />
                <Button type="submit" size="sm" variant="outline" disabled={addingPractice || !newPractice.trim()}>
                  {addingPractice ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
                </Button>
              </form>
            </CardContent>
          </Card>
        )}

        <Separator />

        {/* Subscription Plans */}
        {farm && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-xl font-semibold text-gray-900">Subscription Plans</h2>
                <p className="text-sm text-gray-500">Buyers can subscribe to these on your farm page.</p>
              </div>
              <Button
                size="sm"
                className="bg-green-700 hover:bg-green-800 text-white"
                onClick={() => setShowPlanForm(true)}
              >
                <Plus className="h-4 w-4 mr-1.5" /> New plan
              </Button>
            </div>

            {showPlanForm && (
              <Card className="mb-6 border-green-200">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">New Subscription Plan</CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={createPlan} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1.5 col-span-2">
                        <Label htmlFor="pname">Plan name *</Label>
                        <Input id="pname" value={planName} onChange={(e) => setPlanName(e.target.value)} required placeholder="e.g. Weekly Veggie Box" />
                      </div>
                      <div className="space-y-1.5">
                        <Label htmlFor="pprice">Price (USD) *</Label>
                        <Input id="pprice" type="number" min="0.01" step="0.01" value={planPrice} onChange={(e) => setPlanPrice(e.target.value)} required placeholder="35.00" />
                      </div>
                      <div className="space-y-1.5">
                        <Label htmlFor="pfreq">Frequency *</Label>
                        <select
                          id="pfreq"
                          value={planFreq}
                          onChange={(e) => setPlanFreq(e.target.value as Frequency)}
                          className="w-full h-9 rounded-md border border-input bg-background px-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                        >
                          <option value="Weekly">Weekly</option>
                          <option value="Biweekly">Biweekly</option>
                          <option value="Monthly">Monthly</option>
                        </select>
                      </div>
                      <div className="space-y-1.5 col-span-2">
                        <Label htmlFor="pdesc">Description</Label>
                        <Input id="pdesc" value={planDesc} onChange={(e) => setPlanDesc(e.target.value)} placeholder="What's included?" />
                      </div>
                      <div className="space-y-1.5">
                        <Label htmlFor="pmax">Max subscribers (optional)</Label>
                        <Input id="pmax" type="number" min="1" value={planMax} onChange={(e) => setPlanMax(e.target.value)} placeholder="Leave blank for unlimited" />
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button type="submit" disabled={savingPlan} className="bg-green-700 hover:bg-green-800 text-white">
                        {savingPlan ? <Loader2 className="h-4 w-4 animate-spin" /> : "Create plan"}
                      </Button>
                      <Button type="button" variant="ghost" onClick={() => setShowPlanForm(false)}>Cancel</Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            )}

            <div className="space-y-3">
              {plans.length === 0 && (
                <p className="text-gray-500 text-sm">No plans yet. Create one to start accepting subscribers.</p>
              )}
              {plans.map((plan) => (
                <Card key={plan.id} className={plan.isActive ? "" : "opacity-50"}>
                  <CardContent className="py-4">
                    <div className="flex items-center justify-between gap-4">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-gray-900">{plan.name}</span>
                          {!plan.isActive && <Badge variant="secondary" className="text-xs">Inactive</Badge>}
                        </div>
                        <p className="text-sm text-gray-500">
                          ${plan.price.toFixed(2)} · {plan.frequency}
                          {plan.maxSubscribers ? ` · max ${plan.maxSubscribers}` : ""}
                        </p>
                        {plan.description && (
                          <p className="text-xs text-gray-400 mt-0.5">{plan.description}</p>
                        )}
                      </div>
                      {plan.isActive && (
                        <Button
                          size="sm"
                          variant="ghost"
                          className="text-red-500 hover:text-red-600"
                          onClick={() => deactivatePlan(plan.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      </main>
    </>
  );
}
