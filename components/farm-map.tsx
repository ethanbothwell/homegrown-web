"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { farms as farmsApi, type Farm } from "@/lib/api";
import { MapPin, Navigation2, Search, Star, X } from "lucide-react";

// ─── Oregon city coordinates ──────────────────────────────────────────────────

const CITY_COORDS: Record<string, [number, number]> = {
  Portland:  [45.5051, -122.6750],
  Salem:     [44.9429, -123.0351],
  Corvallis: [44.5646, -123.2620],
  Eugene:    [44.0521, -123.0868],
  Bend:      [44.0582, -121.3153],
  Medford:   [42.3265, -122.8756],
  Astoria:   [46.1879, -123.8313],
  Newport:   [44.6368, -124.0531],
};

const DEFAULT_CENTER: [number, number] = [44.4, -122.9];
const DEFAULT_ZOOM = 7;

// ─── Mock farms ───────────────────────────────────────────────────────────────

const MOCK_FARMS: Farm[] = [
  {
    id: "f1", name: "Sunridge Farm", location: "Corvallis, OR",
    city: "Corvallis", state: "OR",
    bio: "Three generations of sustainable vegetable farming in the Willamette Valley.",
    practices: [{ id: "1", name: "Certified Organic" }, { id: "2", name: "No-Spray" }, { id: "3", name: "Pasture-Raised" }],
    imageUrl: "https://images.unsplash.com/photo-1500076656116-558758c991c1?w=500&q=80",
    rating: 4.9, reviewCount: 42, ownerName: "Jake Sunridge", subscriptionPlans: [],
  },
  {
    id: "f2", name: "Willamette Bakehouse", location: "Salem, OR",
    city: "Salem", state: "OR",
    bio: "Artisan bread and pastries made with heritage grains. Wood-fired oven, baked fresh daily.",
    practices: [{ id: "4", name: "Heritage Grains" }, { id: "5", name: "Wood-Fired" }, { id: "6", name: "Small Batch" }],
    imageUrl: "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=500&q=80",
    rating: 4.8, reviewCount: 28, ownerName: "Marie Dupont", subscriptionPlans: [],
  },
  {
    id: "f3", name: "Cascade Creamery", location: "Portland, OR",
    city: "Portland", state: "OR",
    bio: "Small-batch raw milk dairy. Jersey cows on 40 acres of coastal pasture year-round.",
    practices: [{ id: "7", name: "Raw Milk" }, { id: "8", name: "Grass-Fed" }, { id: "9", name: "Humane Certified" }],
    imageUrl: "https://images.unsplash.com/photo-1628088062854-d1870b4553da?w=500&q=80",
    rating: 4.7, reviewCount: 35, ownerName: "Tom Cascade", subscriptionPlans: [],
  },
  {
    id: "f4", name: "Blue Heron Orchard", location: "Eugene, OR",
    city: "Eugene", state: "OR",
    bio: "Heritage apple and pear varieties grown without synthetic pesticides.",
    practices: [{ id: "10", name: "No Pesticides" }, { id: "11", name: "Heritage Varieties" }, { id: "12", name: "U-Pick" }],
    imageUrl: "https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=500&q=80",
    rating: 4.9, reviewCount: 61, ownerName: "Helen Blue", subscriptionPlans: [],
  },
  {
    id: "f5", name: "Rogue Valley Honey Co.", location: "Medford, OR",
    city: "Medford", state: "OR",
    bio: "Raw wildflower honey from hives scattered across the Rogue Valley.",
    practices: [{ id: "13", name: "Raw Honey" }, { id: "14", name: "Wildflower" }],
    imageUrl: "https://images.unsplash.com/photo-1558642452-9d2a7deb7f62?w=500&q=80",
    rating: 4.8, reviewCount: 19, ownerName: "Ben Rogue", subscriptionPlans: [],
  },
  {
    id: "f6", name: "Coastal Roots Farm", location: "Newport, OR",
    city: "Newport", state: "OR",
    bio: "Ocean-view market garden growing cold-hardy greens and root vegetables.",
    practices: [{ id: "15", name: "No-Spray" }, { id: "16", name: "Market Garden" }],
    imageUrl: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=500&q=80",
    rating: 4.6, reviewCount: 14, ownerName: "Nina Coastal", subscriptionPlans: [],
  },
  {
    id: "f7", name: "Painted Hills Beef", location: "Bend, OR",
    city: "Bend", state: "OR",
    bio: "100% grass-fed and finished beef raised on high-desert rangeland.",
    practices: [{ id: "17", name: "Grass-Fed" }, { id: "18", name: "No Hormones" }, { id: "19", name: "Free Range" }],
    imageUrl: "https://images.unsplash.com/photo-1500595046743-cd271d694d30?w=500&q=80",
    rating: 4.7, reviewCount: 23, ownerName: "Clay Harris", subscriptionPlans: [],
  },
];

// ─── Category helpers ─────────────────────────────────────────────────────────

const CATEGORIES = ["All", "Produce", "Dairy & Eggs", "Bread", "Honey", "Meat", "Orchard"];

const CAT_EMOJI: Record<string, string> = {
  "All": "🌱", "Produce": "🥬", "Dairy & Eggs": "🥛",
  "Bread": "🍞", "Honey": "🍯", "Meat": "🥩", "Orchard": "🍎",
};

const CAT_COLOR: Record<string, string> = {
  "Produce": "#4A7C3F", "Dairy & Eggs": "#5B8DB8", "Bread": "#8B6B3D",
  "Honey": "#C4962D", "Meat": "#8B3A3A", "Orchard": "#C4622D",
};

function deriveCat(farm: Farm): string {
  const p = farm.practices.map((x) => x.name.toLowerCase()).join(" ");
  const n = farm.name.toLowerCase();
  if (p.includes("honey") || n.includes("honey")) return "Honey";
  if (p.includes("raw milk") || p.includes("grass-fed") || n.includes("creamery") || n.includes("dairy")) return "Dairy & Eggs";
  if (p.includes("grain") || p.includes("wood-fired") || n.includes("bake") || n.includes("bread")) return "Bread";
  if (p.includes("beef") || p.includes("pork") || p.includes("poultry") || n.includes("beef") || n.includes("meat")) return "Meat";
  if (p.includes("orchard") || p.includes("apple") || p.includes("pear") || n.includes("orchard")) return "Orchard";
  return "Produce";
}

function getCoords(farm: Farm, index: number): [number, number] {
  const key = Object.keys(CITY_COORDS).find(
    (k) => farm.city?.includes(k) || farm.location?.includes(k)
  );
  if (key) {
    const [lat, lng] = CITY_COORDS[key];
    return [lat + index * 0.0015, lng + index * 0.002];
  }
  return [44.3 + (index % 5) * 0.4 - 1.0, -122.8 + (index % 3) * 0.6 - 0.9];
}

interface FarmWithCoords extends Farm {
  lat: number;
  lng: number;
  category: string;
}

// ─── CSS for map + custom markers ─────────────────────────────────────────────

const MAP_CSS = `
/* Leaflet base reset */
.leaflet-container { font-family: inherit; background: #e8e2d9; }
/* Custom pin */
.hg-pin { position: relative; width: 40px; height: 40px; cursor: pointer; }
.hg-pin-ring {
  position: absolute; inset: -3px; border-radius: 50%;
  border: 2.5px solid var(--c, #2D5016);
  animation: hg-pulse 2.6s ease-out infinite;
  pointer-events: none;
}
@keyframes hg-pulse {
  0%   { transform: scale(0.7);  opacity: 0.85; }
  65%  { transform: scale(2.15); opacity: 0;    }
  100% { transform: scale(2.15); opacity: 0;    }
}
.hg-pin-body {
  position: absolute; inset: 3px; border-radius: 50%;
  background: var(--c, #2D5016);
  display: flex; align-items: center; justify-content: center;
  font-size: 14px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.22), 0 0 0 2.5px #fff;
  transition: transform 0.18s ease, box-shadow 0.18s ease;
}
.hg-pin:hover .hg-pin-body { transform: scale(1.2); box-shadow: 0 4px 16px rgba(0,0,0,0.3), 0 0 0 2.5px #fff; }
.hg-pin.sel .hg-pin-body { background: #C4622D !important; transform: scale(1.28); box-shadow: 0 6px 20px rgba(196,98,45,0.4), 0 0 0 3px #fff; }
/* Popup overrides */
.leaflet-popup-content-wrapper { border-radius: 16px !important; box-shadow: 0 12px 40px rgba(0,0,0,0.14) !important; padding: 0 !important; overflow: hidden; border: 1px solid #e8e2d9; }
.leaflet-popup-content { margin: 0 !important; width: 260px !important; }
.leaflet-popup-tip-container { display: none; }
.leaflet-popup-close-button { display: none !important; }
.hg-popup-img { width: 100%; height: 130px; object-fit: cover; display: block; }
.hg-popup-body { padding: 12px 14px 14px; }
.hg-popup-name { font-weight: 700; font-size: 14px; color: #1a1a1a; margin: 0 0 3px; }
.hg-popup-loc { font-size: 12px; color: #9b9b9b; margin: 0 0 6px; display: flex; align-items: center; gap: 3px; }
.hg-popup-bio { font-size: 11.5px; color: #6b6b6b; line-height: 1.55; margin: 0 0 8px; }
.hg-popup-tags { display: flex; flex-wrap: wrap; gap: 4px; }
.hg-popup-tag { font-size: 11px; font-weight: 600; padding: 2px 8px; border-radius: 99px; }
.hg-popup-rating { float: right; font-size: 12px; color: #6b6b6b; font-weight: 600; }
`;

// ─── Main component ───────────────────────────────────────────────────────────

export default function FarmMap() {
  const mapDivRef  = useRef<HTMLDivElement>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const mapRef     = useRef<any>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const markersRef = useRef<Record<string, any>>({});

  const [allFarms, setAllFarms]     = useState<FarmWithCoords[]>([]);
  const [loading, setLoading]       = useState(true);
  const [query, setQuery]           = useState("");
  const [activeCat, setActiveCat]   = useState("All");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [mobileView, setMobileView] = useState<"map" | "list">("map");
  const listRef = useRef<HTMLDivElement>(null);

  // ── 1. Load farms ──────────────────────────────────────────────────────────
  useEffect(() => {
    farmsApi.list()
      .then((data) => {
        const src = data.length ? data : MOCK_FARMS;
        setAllFarms(src.map((f, i) => ({ ...f, lat: getCoords(f, i)[0], lng: getCoords(f, i)[1], category: deriveCat(f) })));
      })
      .catch(() => {
        setAllFarms(MOCK_FARMS.map((f, i) => ({ ...f, lat: getCoords(f, i)[0], lng: getCoords(f, i)[1], category: deriveCat(f) })));
      })
      .finally(() => setLoading(false));
  }, []);

  // ── 2. Init Leaflet map once DOM is ready ──────────────────────────────────
  useEffect(() => {
    if (!mapDivRef.current || mapRef.current) return;

    const map = L.map(mapDivRef.current, {
      center: DEFAULT_CENTER,
      zoom: DEFAULT_ZOOM,
      zoomControl: false,
      scrollWheelZoom: true,
    });

    L.tileLayer(
      "https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png",
      { attribution: "© CARTO © OSM", maxZoom: 19 }
    ).addTo(map);

    L.control.zoom({ position: "bottomright" }).addTo(map);

    mapRef.current = map;

    return () => {
      mapRef.current?.remove();
      mapRef.current = null;
    };
  }, []);

  // ── 3. Sync markers whenever farms or selection changes ────────────────────
  useEffect(() => {
    if (!mapRef.current || !allFarms.length) return;

    const map = mapRef.current;

    // Remove old markers
    Object.values(markersRef.current).forEach((m) => m.remove());
    markersRef.current = {};

    allFarms.forEach((farm) => {
      const color = CAT_COLOR[farm.category] ?? "#2D5016";
      const emoji = CAT_EMOJI[farm.category] ?? "🌱";
      const isSel = selectedId === farm.id;

      const icon = L.divIcon({
        className: "",
        html: `<div class="hg-pin${isSel ? " sel" : ""}" style="--c:${color}"><div class="hg-pin-ring"></div><div class="hg-pin-body">${emoji}</div></div>`,
        iconSize:    [40, 40],
        iconAnchor:  [20, 20],
        popupAnchor: [0, -24],
      });

      const imgHtml   = farm.imageUrl ? `<img class="hg-popup-img" src="${farm.imageUrl}" alt="${farm.name}" />` : "";
      const bioHtml   = farm.bio ? `<p class="hg-popup-bio">${farm.bio.slice(0, 90)}${farm.bio.length > 90 ? "\u2026" : ""}</p>` : "";
      const tagsHtml  = farm.practices.slice(0, 3).map((p) => `<span class="hg-popup-tag" style="background:${color}18;color:${color}">${p.name}</span>`).join("");
      const popupHtml = `<div>${imgHtml}<div class="hg-popup-body"><span class="hg-popup-rating">⭐ ${farm.rating.toFixed(1)}</span><p class="hg-popup-name">${farm.name}</p><p class="hg-popup-loc">📍 ${farm.city || farm.location || ""}</p>${bioHtml}<div class="hg-popup-tags">${tagsHtml}</div></div></div>`;
      const popup = L.popup({ closeButton: false, maxWidth: 280 }).setContent(popupHtml);

      const marker = L.marker([farm.lat, farm.lng], { icon, riseOnHover: true })
        .bindPopup(popup)
        .addTo(map);

      marker.on("click", () => setSelectedId(farm.id));
      markersRef.current[farm.id] = marker;
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [allFarms, selectedId]);

  // ── 4. Open popup when farm selected ──────────────────────────────────────
  useEffect(() => {
    if (!selectedId || !mapRef.current) return;
    const marker = markersRef.current[selectedId];
    if (!marker) return;
    marker.openPopup();
    // Scroll the sidebar card into view
    listRef.current?.querySelector<HTMLElement>(`[data-id="${selectedId}"]`)?.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }, [selectedId]);

  // ── 5. Geolocation ─────────────────────────────────────────────────────────
  const locate = useCallback(() => {
    if (!navigator.geolocation || !mapRef.current) return;
    navigator.geolocation.getCurrentPosition(({ coords }) => {
      const map = mapRef.current;
      map.flyTo([coords.latitude, coords.longitude], 11, { animate: true, duration: 0.9 });
      L.circleMarker([coords.latitude, coords.longitude], {
        radius: 9, fillColor: "#4285F4", color: "#fff", weight: 2.5, fillOpacity: 1,
      }).addTo(map);
    });
  }, []);

  // ── 6. Click card → fly to farm ────────────────────────────────────────────
  function selectFarm(farm: FarmWithCoords) {
    setSelectedId(farm.id);
    setMobileView("map");
    mapRef.current?.flyTo([farm.lat, farm.lng], 13, { animate: true, duration: 0.85 });
  }

  // ── Filtered list ──────────────────────────────────────────────────────────
  const filtered = allFarms.filter((f) => {
    const catOk  = activeCat === "All" || f.category === activeCat;
    const q      = query.toLowerCase();
    const textOk = !q || f.name.toLowerCase().includes(q) || f.location?.toLowerCase().includes(q) || f.city?.toLowerCase().includes(q);
    return catOk && textOk;
  });

  return (
    <>
      <style>{MAP_CSS}</style>

      <div className="flex overflow-hidden" style={{ height: "calc(100svh - 64px)" }}>

        {/* ── Sidebar ────────────────────────────────────────────────────── */}
        <aside
          ref={listRef}
          className={`${mobileView === "list" ? "flex" : "hidden"} lg:flex flex-col flex-shrink-0`}
          style={{ width: 320, backgroundColor: "#FAF7F2", borderRight: "1px solid #e8e2d9" }}
        >
          {/* Header */}
          <div className="px-4 pt-4 pb-3" style={{ borderBottom: "1px solid #e8e2d9" }}>
            <div className="flex items-center justify-between mb-3">
              <h2 className="font-heading font-bold text-lg" style={{ color: "#1a2e0a" }}>Farm Map</h2>
              <button
                onClick={locate}
                className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full transition-all hover:-translate-y-0.5"
                style={{ backgroundColor: "rgba(45,80,22,0.08)", color: "#2D5016" }}
              >
                <Navigation2 size={11} /> Near me
              </button>
            </div>
            {/* Search */}
            <div className="relative">
              <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: "#9b9b9b" }} />
              <input
                type="text"
                placeholder="Search farms…"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full rounded-full pl-8 pr-8 py-2 text-sm outline-none"
                style={{ backgroundColor: "#f0ebe3", border: "1.5px solid transparent", color: "#1a1a1a" }}
                onFocus={(e) => (e.target.style.borderColor = "#2D5016")}
                onBlur={(e)  => (e.target.style.borderColor = "transparent")}
              />
              {query && (
                <button className="absolute right-3 top-1/2 -translate-y-1/2" onClick={() => setQuery("")}>
                  <X size={12} style={{ color: "#9b9b9b" }} />
                </button>
              )}
            </div>
          </div>

          {/* Category chips */}
          <div className="flex gap-1.5 px-3 py-2.5 overflow-x-auto" style={{ borderBottom: "1px solid #e8e2d9", scrollbarWidth: "none" }}>
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCat(cat)}
                className="flex-shrink-0 whitespace-nowrap rounded-full text-xs font-semibold px-3 py-1.5 transition-all"
                style={{
                  backgroundColor: activeCat === cat ? "#2D5016" : "#f0ebe3",
                  color:           activeCat === cat ? "#FAF7F2" : "#6b6b6b",
                }}
              >
                {cat !== "All" ? `${CAT_EMOJI[cat]} ${cat}` : cat}
              </button>
            ))}
          </div>

          {/* Count */}
          <div className="px-4 py-2 text-xs" style={{ color: "#aaa" }}>
            {loading ? "Loading farms…" : `${filtered.length} farm${filtered.length !== 1 ? "s" : ""} shown`}
          </div>

          {/* Farm cards */}
          <div className="flex-1 overflow-y-auto pb-20 lg:pb-4">
            {loading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="flex gap-3 p-3 mx-2 mb-1 rounded-xl animate-pulse" style={{ backgroundColor: "#f0ebe3" }}>
                  <div className="rounded-xl flex-shrink-0" style={{ width: 62, height: 62, backgroundColor: "#e8e2d9" }} />
                  <div className="flex-1 py-1 space-y-2">
                    <div className="h-3 rounded-full" style={{ backgroundColor: "#e8e2d9", width: "65%" }} />
                    <div className="h-2 rounded-full" style={{ backgroundColor: "#e8e2d9", width: "45%" }} />
                    <div className="h-5 rounded-full" style={{ backgroundColor: "#e8e2d9", width: "35%" }} />
                  </div>
                </div>
              ))
            ) : filtered.length === 0 ? (
              <div className="py-16 text-center">
                <p className="text-2xl mb-2">🌾</p>
                <p className="text-sm" style={{ color: "#9b9b9b" }}>No farms match your filters.</p>
              </div>
            ) : (
              filtered.map((farm) => {
                const color = CAT_COLOR[farm.category] ?? "#2D5016";
                const isSel = selectedId === farm.id;
                return (
                  <button
                    key={farm.id}
                    data-id={farm.id}
                    onClick={() => selectFarm(farm)}
                    className="w-full text-left flex gap-3 p-3 rounded-xl transition-all"
                    style={{
                      margin: "2px 8px",
                      width: "calc(100% - 16px)",
                      backgroundColor: isSel ? "rgba(45,80,22,0.07)" : "transparent",
                      border: `1.5px solid ${isSel ? "rgba(45,80,22,0.2)" : "transparent"}`,
                    }}
                  >
                    <div className="rounded-xl overflow-hidden flex-shrink-0" style={{ width: 62, height: 62 }}>
                      {farm.imageUrl
                        ? <img src={farm.imageUrl} alt={farm.name} className="w-full h-full object-cover" /> // eslint-disable-line @next/next/no-img-element
                        : <div className="w-full h-full flex items-center justify-center text-2xl" style={{ backgroundColor: "#f0ebe3" }}>{CAT_EMOJI[farm.category]}</div>
                      }
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-1 mb-0.5">
                        <span className="font-semibold text-sm truncate" style={{ color: "#1a1a1a" }}>{farm.name}</span>
                        <span className="flex items-center gap-0.5 flex-shrink-0 text-xs font-medium" style={{ color: "#6b6b6b" }}>
                          <Star size={10} fill="#D4A96A" stroke="none" />{farm.rating.toFixed(1)}
                        </span>
                      </div>
                      <div className="flex items-center gap-1 mb-2">
                        <MapPin size={10} style={{ color: "#9b9b9b" }} />
                        <span className="text-xs truncate" style={{ color: "#9b9b9b" }}>{farm.city || farm.location}</span>
                      </div>
                      <span className="inline-block text-xs font-semibold px-2 py-0.5 rounded-full" style={{ backgroundColor: `${color}18`, color }}>
                        {CAT_EMOJI[farm.category]} {farm.category}
                      </span>
                    </div>
                  </button>
                );
              })
            )}
          </div>
        </aside>

        {/* ── Map ─────────────────────────────────────────────────────────── */}
        <div
          className={`${mobileView === "map" ? "block" : "hidden"} lg:block flex-1 relative`}
          style={{ minWidth: 0 }}
        >
          {/* Leaflet mounts here */}
          <div ref={mapDivRef} style={{ position: "absolute", inset: 0 }} />

          {/* Locate button */}
          <button
            onClick={locate}
            title="Find farms near me"
            className="absolute z-[1000] flex items-center justify-center transition-all hover:-translate-y-0.5"
            style={{
              top: 12, right: 12, width: 42, height: 42, borderRadius: "50%",
              backgroundColor: "#fff",
              boxShadow: "0 2px 14px rgba(0,0,0,0.14)",
              border: "1px solid #e8e2d9",
            }}
          >
            <Navigation2 size={16} style={{ color: "#2D5016" }} />
          </button>
        </div>
      </div>

      {/* ── Mobile toggle ──────────────────────────────────────────────── */}
      <div
        className="fixed bottom-5 left-1/2 -translate-x-1/2 z-[1100] lg:hidden flex rounded-full overflow-hidden"
        style={{ boxShadow: "0 4px 24px rgba(0,0,0,0.2)", border: "1.5px solid rgba(255,255,255,0.15)" }}
      >
        {(["map", "list"] as const).map((v) => (
          <button
            key={v}
            onClick={() => {
              setMobileView(v);
              if (v === "map") setTimeout(() => mapRef.current?.invalidateSize(), 50);
            }}
            className="px-6 py-2.5 text-sm font-semibold"
            style={{
              backgroundColor: mobileView === v ? "#2D5016" : "#FAF7F2",
              color:           mobileView === v ? "#FAF7F2" : "#2D5016",
            }}
          >
            {v === "map" ? "🗺 Map" : "☰ List"}
          </button>
        ))}
      </div>
    </>
  );
}
