"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Nav } from "@/components/nav";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
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
      <main className="max-w-6xl mx-auto px-4 py-10">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Browse Farms</h1>
          <p className="text-gray-500 mt-1">Find local farms near you and subscribe to fresh produce.</p>
        </div>

        {loading && (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="h-6 w-6 animate-spin text-green-600" />
          </div>
        )}

        {error && (
          <div className="text-center py-20 text-red-500">
            Failed to load farms: {error}
          </div>
        )}

        {!loading && !error && farms.length === 0 && (
          <div className="text-center py-20 text-gray-500">
            No farms listed yet. Check back soon!
          </div>
        )}

        {!loading && !error && farms.length > 0 && (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {farms.map((farm) => (
              <Link key={farm.id} href={`/farms/${farm.id}`}>
                <Card className="h-full hover:shadow-md transition-shadow cursor-pointer">
                  {farm.imageUrl && (
                    <div className="h-40 overflow-hidden rounded-t-xl">
                      <img
                        src={farm.imageUrl}
                        alt={farm.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">{farm.name}</CardTitle>
                    {farm.location && (
                      <CardDescription className="flex items-center gap-1">
                        <MapPin className="h-3.5 w-3.5" />
                        {farm.location}
                      </CardDescription>
                    )}
                  </CardHeader>
                  <CardContent>
                    {farm.bio && (
                      <p className="text-sm text-gray-600 mb-3 line-clamp-2">{farm.bio}</p>
                    )}
                    <div className="flex flex-wrap gap-1.5">
                      {(farm.practices ?? []).slice(0, 4).map((p) => (
                        <Badge key={p.id} variant="secondary" className="text-xs">
                          {p.name}
                        </Badge>
                      ))}
                    </div>
                    {(farm.subscriptionPlans ?? []).filter((p) => p.isActive).length > 0 && (
                      <p className="text-xs text-green-700 font-medium mt-3">
                        {(farm.subscriptionPlans ?? []).filter((p) => p.isActive).length} subscription plan
                        {(farm.subscriptionPlans ?? []).filter((p) => p.isActive).length !== 1 ? "s" : ""} available
                      </p>
                    )}
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </main>
    </>
  );
}
