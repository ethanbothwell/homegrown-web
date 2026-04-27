"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Nav } from "@/components/nav";
import { Badge } from "@/components/ui/badge";
import { farms as farmsApi, Farm } from "@/lib/api";
import { MapPin, Loader2 } from "lucide-react";

export default function FarmsPage() {
  const [farms, setFarms] = useState<Farm[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    farmsApi
      .list()
      .then(setFarms)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

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

        {loading && (
          <div className="flex items-center justify-center py-24">
            <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
          </div>
        )}

        {error && (
          <div className="text-center py-24 text-muted-foreground text-sm">
            Couldn&apos;t load farms right now. Try again in a moment.
          </div>
        )}

        {!loading && !error && farms.length === 0 && (
          <div className="text-center py-24 text-muted-foreground text-sm">
            No farms listed yet — check back soon.
          </div>
        )}

        {!loading && !error && farms.length > 0 && (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {farms.map((farm) => (
              <Link key={farm.id} href={`/farms/${farm.id}`} className="group">
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
            ))}
          </div>
        )}
      </main>
    </>
  );
}
