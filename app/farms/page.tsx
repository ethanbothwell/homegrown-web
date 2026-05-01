"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Nav } from "@/components/nav";
import { Badge } from "@/components/ui/badge";
import { farms as farmsApi, Farm } from "@/lib/api";
import { MapPin, Loader2, ArrowRight } from "lucide-react";
import { useAuth } from "@/lib/auth-context";

// ─── Mock farms (shown to unauthenticated visitors) ──────────────────────────
// Same farms as the demo/preview page, spread across the Corvallis metro area.

const MOCK_FARMS: Farm[] = [
  {
    id: "mock-f1",
    name: "Sunridge Farm",
    location: "South Corvallis, OR",
    bio: "Three generations of sustainable vegetable farming in the Willamette Valley. Certified organic since 1998.",
    imageUrl: "https://images.unsplash.com/photo-1500076656116-558758c991c1?w=600&q=80",
    rating: 4.9,
    reviewCount: 0,
    ownerName: "Sunridge Farm",
    practices: [
      { id: "p1", name: "Certified Organic" },
      { id: "p2", name: "No-Spray" },
      { id: "p3", name: "Pasture-Raised" },
    ],
    subscriptionPlans: [
      { id: "sp1", farmId: "mock-f1", farmName: "Sunridge Farm", name: "Weekly Veggie Box", price: 45, frequency: "Weekly", isActive: true, createdAt: "", updatedAt: "" },
      { id: "sp2", farmId: "mock-f1", farmName: "Sunridge Farm", name: "Egg Share", price: 8, frequency: "Weekly", isActive: true, createdAt: "", updatedAt: "" },
    ],
  },
  {
    id: "mock-f2",
    name: "Willamette Bakehouse",
    location: "Downtown Corvallis, OR",
    bio: "Artisan bread and pastries made with heritage grains from local farms. Wood-fired oven, baked fresh daily.",
    imageUrl: "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=600&q=80",
    rating: 4.8,
    reviewCount: 0,
    ownerName: "Willamette Bakehouse",
    practices: [
      { id: "p4", name: "Heritage Grains" },
      { id: "p5", name: "Wood-Fired" },
      { id: "p6", name: "Small Batch" },
    ],
    subscriptionPlans: [
      { id: "sp3", farmId: "mock-f2", farmName: "Willamette Bakehouse", name: "Weekly Bread Box", price: 22, frequency: "Weekly", isActive: true, createdAt: "", updatedAt: "" },
    ],
  },
  {
    id: "mock-f3",
    name: "Cascade Creamery",
    location: "Philomath, OR",
    bio: "Small-batch raw milk dairy. Our Jersey cows graze on 40 acres of coastal pasture year-round.",
    imageUrl: "https://images.unsplash.com/photo-1628088062854-d1870b4553da?w=600&q=80",
    rating: 4.7,
    reviewCount: 0,
    ownerName: "Cascade Creamery",
    practices: [
      { id: "p7", name: "Raw Milk" },
      { id: "p8", name: "Grass-Fed" },
      { id: "p9", name: "Humane Certified" },
    ],
    subscriptionPlans: [
      { id: "sp4", farmId: "mock-f3", farmName: "Cascade Creamery", name: "Monthly Dairy Share", price: 85, frequency: "Monthly", isActive: true, createdAt: "", updatedAt: "" },
    ],
  },
  {
    id: "mock-f4",
    name: "Blue Heron Orchard",
    location: "Monroe, OR",
    bio: "Heritage apple and pear varieties grown without synthetic pesticides. U-pick available in season.",
    imageUrl: "https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=600&q=80",
    rating: 4.9,
    reviewCount: 0,
    ownerName: "Blue Heron Orchard",
    practices: [
      { id: "p10", name: "No Pesticides" },
      { id: "p11", name: "Heritage Varieties" },
      { id: "p12", name: "U-Pick" },
    ],
    subscriptionPlans: [
      { id: "sp5", farmId: "mock-f4", farmName: "Blue Heron Orchard", name: "Fall Apple Box", price: 28, frequency: "Biweekly", isActive: true, createdAt: "", updatedAt: "" },
    ],
  },
];

// ─── Farm card ────────────────────────────────────────────────────────────────

function FarmCard({ farm, href }: { farm: Farm; href: string }) {
  return (
    <Link href={href} className="group">
      <div className="bg-card border border-border rounded-xl overflow-hidden hover:shadow-md transition-shadow duration-200">
        {farm.imageUrl ? (
          <div className="h-48 overflow-hidden">
            <img
              src={farm.imageUrl}
              alt={farm.name}
              className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-300"
            />
          </div>
        ) : (
          <div className="h-48 bg-muted flex items-center justify-center">
            <span className="font-heading text-4xl text-muted-foreground/30">
              {farm.name.charAt(0)}
            </span>
          </div>
        )}

        <div className="p-5">
          <h2 className="font-heading font-semibold text-lg text-foreground mb-1 group-hover:text-primary transition-colors">
            {farm.name}
          </h2>

          {farm.location && (
            <p className="text-xs text-muted-foreground flex items-center gap-1 mb-3">
              <MapPin className="h-3 w-3" />
              {farm.location}
            </p>
          )}

          {farm.bio && (
            <p className="text-sm text-muted-foreground line-clamp-2 mb-4 leading-relaxed">
              {farm.bio}
            </p>
          )}

          <div className="flex flex-wrap gap-1.5">
            {(farm.practices ?? []).slice(0, 3).map((p) => (
              <Badge
                key={p.id}
                variant="secondary"
                className="text-xs font-normal rounded-full px-2.5"
              >
                {p.name}
              </Badge>
            ))}
          </div>

          {(farm.subscriptionPlans ?? []).filter((p) => p.isActive).length > 0 && (
            <p className="text-xs text-primary font-medium mt-4">
              {(farm.subscriptionPlans ?? []).filter((p) => p.isActive).length} plan
              {(farm.subscriptionPlans ?? []).filter((p) => p.isActive).length !== 1 ? "s" : ""} available
            </p>
          )}
        </div>
      </div>
    </Link>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function FarmsPage() {
  const { user, loading: authLoading } = useAuth();
  const [farms, setFarms] = useState<Farm[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (authLoading) return;

    if (!user) {
      // Not signed in — use mock data immediately
      setLoading(false);
      return;
    }

    // Signed in — fetch real farms
    farmsApi
      .list()
      .then(setFarms)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [user, authLoading]);

  const isPreview = !authLoading && !user;
  const displayFarms = isPreview ? MOCK_FARMS : farms;

  return (
    <>
      <Nav />
      <main className="max-w-6xl mx-auto px-6 py-14">
        <div className="mb-12">
          <p className="text-xs font-semibold tracking-widest uppercase text-muted-foreground mb-3">
            Local farms
          </p>
          <h1 className="font-heading text-4xl font-bold text-foreground">
            Find your farm.
          </h1>
        </div>

        {/* Preview banner for unauthenticated users */}
        {isPreview && (
          <div
            className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 rounded-xl px-5 py-4 mb-10"
            style={{ backgroundColor: "rgba(45,80,22,0.06)", border: "1.5px solid rgba(45,80,22,0.15)" }}
          >
            <p className="text-sm" style={{ color: "#3A3530" }}>
              <span className="font-semibold" style={{ color: "#2D5016" }}>Preview mode</span>
              {" "}— these are sample farms near Corvallis. Sign in to browse real farms and subscribe.
            </p>
            <Link
              href="/register"
              className="inline-flex items-center gap-1.5 text-sm font-semibold whitespace-nowrap transition-colors hover:underline"
              style={{ color: "#B85C27" }}
            >
              Join the waitlist
              <ArrowRight size={13} />
            </Link>
          </div>
        )}

        {/* Loading */}
        {(loading || authLoading) && (
          <div className="flex items-center justify-center py-24">
            <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
          </div>
        )}

        {/* Error (only for authenticated users) */}
        {!loading && !authLoading && error && (
          <div className="text-center py-24 text-muted-foreground text-sm">
            Couldn&apos;t load farms right now. Try again in a moment.
          </div>
        )}

        {/* Empty state (only for authenticated users with no farms) */}
        {!loading && !authLoading && !error && user && farms.length === 0 && (
          <div className="text-center py-24 text-muted-foreground text-sm">
            No farms listed yet — check back soon.
          </div>
        )}

        {/* Farm grid */}
        {!loading && !authLoading && !error && displayFarms.length > 0 && (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {displayFarms.map((farm) => (
              <FarmCard
                key={farm.id}
                farm={farm}
                href={isPreview ? "/register" : `/farms/${farm.id}`}
              />
            ))}
          </div>
        )}
      </main>
    </>
  );
}
