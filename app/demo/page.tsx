"use client";

import Link from "next/link";
import { Nav } from "@/components/nav";
import { MapPin, Star, Package, ArrowRight, Lock } from "lucide-react";

// ─── Mock data ───────────────────────────────────────────────────────────────

const MOCK_FARMS = [
  {
    id: "f1",
    name: "Sunridge Farm",
    location: "Corvallis, OR",
    bio: "Three generations of sustainable vegetable farming in the Willamette Valley. Certified organic since 1998.",
    practices: ["Certified Organic", "No-Spray", "Pasture-Raised"],
    imageUrl: "https://images.unsplash.com/photo-1500076656116-558758c991c1?w=600&q=80",
    plans: 2,
    rating: 4.9,
  },
  {
    id: "f2",
    name: "Willamette Bakehouse",
    location: "Salem, OR",
    bio: "Artisan bread and pastries made with heritage grains from local farms. Wood-fired oven, baked fresh daily.",
    practices: ["Heritage Grains", "Wood-Fired", "Small Batch"],
    imageUrl: "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=600&q=80",
    plans: 1,
    rating: 4.8,
  },
  {
    id: "f3",
    name: "Cascade Creamery",
    location: "Portland, OR",
    bio: "Small-batch raw milk dairy. Our Jersey cows graze on 40 acres of coastal pasture year-round.",
    practices: ["Raw Milk", "Grass-Fed", "Humane Certified"],
    imageUrl: "https://images.unsplash.com/photo-1628088062854-d1870b4553da?w=600&q=80",
    plans: 3,
    rating: 4.7,
  },
  {
    id: "f4",
    name: "Blue Heron Orchard",
    location: "Eugene, OR",
    bio: "Heritage apple and pear varieties grown without synthetic pesticides. U-pick available in season.",
    practices: ["No Pesticides", "Heritage Varieties", "U-Pick"],
    imageUrl: "https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=600&q=80",
    plans: 2,
    rating: 4.9,
  },
];

const CATEGORY_COLORS: Record<string, string> = {
  "Farm Box": "#2D5016",
  "Eggs":     "#C4622D",
  "Bread":    "#8B6B3D",
  "Pastries": "#9B4E6B",
  "Produce":  "#4A7C3F",
  "Dairy":    "#5B8DB8",
};

const MOCK_PRODUCTS = [
  {
    id: "p1",
    farmName: "Sunridge Farm",
    name: "Dozen Pasture-Raised Eggs",
    category: "Eggs",
    price: 8.00,
    unit: "dozen",
    imageUrl: "https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f?w=400&q=80",
    description: "Rich orange yolks from hens raised on open pasture.",
  },
  {
    id: "p2",
    farmName: "Sunridge Farm",
    name: "Weekly Veggie Box",
    category: "Farm Box",
    price: 45.00,
    unit: "box",
    imageUrl: "https://images.unsplash.com/photo-1540420773420-3366772f4999?w=400&q=80",
    description: "8–10 seasonal vegetables, harvested the morning of delivery.",
  },
  {
    id: "p3",
    farmName: "Willamette Bakehouse",
    name: "Country Sourdough Loaf",
    category: "Bread",
    price: 12.00,
    unit: "loaf",
    imageUrl: "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400&q=80",
    description: "72-hour ferment with Oregon hard red wheat.",
  },
  {
    id: "p4",
    farmName: "Willamette Bakehouse",
    name: "Croissant Box (6)",
    category: "Pastries",
    price: 18.00,
    unit: "box",
    imageUrl: "https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=400&q=80",
    description: "Laminated with local cultured butter. Baked fresh daily.",
  },
  {
    id: "p5",
    farmName: "Cascade Creamery",
    name: "Raw Whole Milk",
    category: "Dairy",
    price: 14.00,
    unit: "gallon",
    imageUrl: "https://images.unsplash.com/photo-1550583724-b2692b85b150?w=400&q=80",
    description: "Non-homogenized, cream-top. Jersey cows on coastal pasture.",
  },
  {
    id: "p6",
    farmName: "Blue Heron Orchard",
    name: "Mixed Heritage Apple Box",
    category: "Produce",
    price: 28.00,
    unit: "10 lb",
    imageUrl: "https://images.unsplash.com/photo-1506484381205-f7945653044d?w=400&q=80",
    description: "Cox's Orange Pippin, Gravenstein, Newtown Pippin and more.",
  },
];

const REGISTER_URL = "/register?from=demo";

// ─── Gate wrapper — any interactive element links here ────────────────────────

function GateLink({ children, className, style }: {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <Link href={REGISTER_URL} className={className} style={style}>
      {children}
    </Link>
  );
}

// ─── Farm card ────────────────────────────────────────────────────────────────

function FarmCard({ farm }: { farm: typeof MOCK_FARMS[0] }) {
  return (
    <div
      className="rounded-2xl overflow-hidden flex flex-col group transition-all duration-200 hover:-translate-y-1"
      style={{ backgroundColor: "#ffffff", border: "1.5px solid #e8e2d9", boxShadow: "0 2px 8px rgba(0,0,0,0.04)" }}
    >
      {/* Image */}
      <div className="relative overflow-hidden" style={{ height: "180px" }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={farm.imageUrl}
          alt={farm.name}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(0,0,0,0.4) 0%, transparent 60%)" }} />
        <div className="absolute bottom-3 left-3 flex items-center gap-1">
          <Star size={12} fill="#D4A96A" stroke="none" />
          <span className="text-xs font-bold text-white">{farm.rating}</span>
        </div>
      </div>

      {/* Info */}
      <div className="p-5 flex flex-col flex-1">
        <h3 className="font-heading font-bold text-lg mb-0.5" style={{ color: "#1a1a1a" }}>{farm.name}</h3>
        <div className="flex items-center gap-1 mb-3">
          <MapPin size={12} style={{ color: "#9b9b9b" }} />
          <span className="text-xs" style={{ color: "#9b9b9b" }}>{farm.location}</span>
        </div>
        <p className="text-sm leading-relaxed mb-4 flex-1" style={{ color: "#6b6b6b" }}>{farm.bio}</p>

        {/* Practices */}
        <div className="flex flex-wrap gap-1.5 mb-4">
          {farm.practices.map((p) => (
            <span
              key={p}
              className="text-xs px-2.5 py-0.5 rounded-full font-medium"
              style={{ backgroundColor: "rgba(45,80,22,0.08)", color: "#2D5016" }}
            >
              {p}
            </span>
          ))}
        </div>

        <GateLink
          className="flex items-center justify-center gap-2 w-full rounded-full py-2.5 font-semibold text-sm transition-all duration-200 hover:-translate-y-0.5"
          style={{ backgroundColor: "#2D5016", color: "#FAF7F2" }}
        >
          <Lock size={12} />
          View farm &amp; subscribe
        </GateLink>
      </div>
    </div>
  );
}

// ─── Product card ─────────────────────────────────────────────────────────────

function ProductCard({ product }: { product: typeof MOCK_PRODUCTS[0] }) {
  const color = CATEGORY_COLORS[product.category] ?? "#2D5016";

  return (
    <div
      className="rounded-2xl overflow-hidden flex flex-col group transition-all duration-200 hover:-translate-y-1"
      style={{ backgroundColor: "#ffffff", border: "1.5px solid #e8e2d9", boxShadow: "0 2px 8px rgba(0,0,0,0.04)" }}
    >
      <div className="relative overflow-hidden" style={{ aspectRatio: "1/1", backgroundColor: "#f5f0e8" }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={product.imageUrl}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <span
          className="absolute top-2.5 left-2.5 text-xs font-bold px-2.5 py-1 rounded-full"
          style={{ backgroundColor: color, color: "#FAF7F2" }}
        >
          {product.category}
        </span>
      </div>

      <div className="p-4 flex flex-col flex-1">
        <p className="text-xs mb-1 truncate" style={{ color: "#9b9b9b" }}>{product.farmName}</p>
        <h3 className="font-semibold text-sm leading-snug mb-1" style={{ color: "#1a1a1a" }}>{product.name}</h3>
        <p className="text-xs leading-relaxed mb-auto" style={{ color: "#6b6b6b" }}>{product.description}</p>

        <div
          className="flex items-center justify-between mt-3 pt-3"
          style={{ borderTop: "1px solid #f0ebe3" }}
        >
          <div>
            <span className="font-bold text-base" style={{ color: "#1a1a1a" }}>${product.price.toFixed(2)}</span>
            <span className="text-xs ml-1" style={{ color: "#9b9b9b" }}>/ {product.unit}</span>
          </div>
          <GateLink
            className="flex items-center gap-1 text-xs font-semibold px-3 py-1.5 rounded-full transition-all duration-200 hover:-translate-y-0.5"
            style={{ backgroundColor: "#C4622D", color: "#ffffff" }}
          >
            <Lock size={10} />
            Get it
          </GateLink>
        </div>
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function DemoPage() {
  return (
    <div style={{ minHeight: "100svh", backgroundColor: "#FAF7F2" }}>
      <Nav />

      {/* Demo banner */}
      <div
        className="sticky top-16 z-40 py-2.5 px-4 text-center text-sm font-medium flex items-center justify-center gap-3"
        style={{ backgroundColor: "#1a2e0a", color: "rgba(250,247,242,0.9)" }}
      >
        <span>You&apos;re viewing a preview — HomeGrown isn&apos;t live yet.</span>
        <Link
          href={REGISTER_URL}
          className="flex items-center gap-1 font-bold hover:underline"
          style={{ color: "#D4A96A" }}
        >
          Join your city&apos;s waitlist
          <ArrowRight size={13} />
        </Link>
      </div>

      {/* Hero */}
      <div
        className="py-16 px-6 text-center"
        style={{ borderBottom: "1px solid #e8e2d9" }}
      >
        <span
          className="inline-block text-xs font-bold tracking-widest uppercase mb-3 px-3 py-1 rounded-full"
          style={{ backgroundColor: "rgba(45,80,22,0.08)", color: "#2D5016" }}
        >
          Demo Preview
        </span>
        <h1
          className="font-heading font-bold mb-3"
          style={{ fontSize: "clamp(2rem,5vw,3rem)", color: "#1a2e0a" }}
        >
          Here&apos;s what HomeGrown looks like.
        </h1>
        <p className="text-base max-w-lg mx-auto mb-8" style={{ color: "#6b6b6b", lineHeight: 1.7 }}>
          Browse local farms and fresh products below. Join the waitlist and you&apos;ll
          be notified the moment HomeGrown unlocks in your city.
        </p>
        <Link
          href={REGISTER_URL}
          className="inline-flex items-center gap-2 rounded-full px-8 py-3.5 font-semibold text-sm transition-all duration-300 hover:-translate-y-0.5"
          style={{ backgroundColor: "#C4622D", color: "#ffffff", boxShadow: "0 4px 20px rgba(196,98,45,0.3)" }}
        >
          Join the waitlist — it&apos;s free
          <ArrowRight size={15} />
        </Link>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-14 space-y-16">

        {/* ── Farms ── */}
        <section>
          <div className="flex items-end justify-between mb-8">
            <div>
              <span
                className="inline-block text-xs font-bold tracking-widest uppercase mb-2"
                style={{ color: "#2D5016" }}
              >
                Local Farms
              </span>
              <h2 className="font-heading text-3xl font-bold" style={{ color: "#1a2e0a" }}>
                Meet your farmers.
              </h2>
            </div>
            <GateLink
              className="hidden sm:flex items-center gap-1.5 text-sm font-semibold hover:underline"
              style={{ color: "#2D5016" }}
            >
              Browse all farms
              <ArrowRight size={14} />
            </GateLink>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {MOCK_FARMS.map((farm) => (
              <FarmCard key={farm.id} farm={farm} />
            ))}
          </div>
        </section>

        {/* ── Products ── */}
        <section>
          <div className="flex items-end justify-between mb-8">
            <div>
              <span
                className="inline-block text-xs font-bold tracking-widest uppercase mb-2"
                style={{ color: "#C4622D" }}
              >
                Marketplace
              </span>
              <h2 className="font-heading text-3xl font-bold" style={{ color: "#1a2e0a" }}>
                Fresh from the source.
              </h2>
            </div>
            <GateLink
              className="hidden sm:flex items-center gap-1.5 text-sm font-semibold hover:underline"
              style={{ color: "#2D5016" }}
            >
              Browse marketplace
              <ArrowRight size={14} />
            </GateLink>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {MOCK_PRODUCTS.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>

        {/* ── Bottom CTA ── */}
        <section
          className="rounded-3xl py-16 px-8 text-center"
          style={{ backgroundColor: "#2D5016" }}
        >
          <Package size={36} className="mx-auto mb-4" style={{ color: "rgba(212,169,106,0.8)" }} />
          <h2 className="font-heading text-3xl font-bold text-white mb-3">
            Ready to get started?
          </h2>
          <p className="text-base mb-8 max-w-md mx-auto" style={{ color: "rgba(255,255,255,0.75)", lineHeight: 1.7 }}>
            Join the waitlist for your city. When enough farmers and buyers sign up,
            HomeGrown unlocks and deliveries begin.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href={REGISTER_URL}
              className="inline-flex items-center justify-center gap-2 rounded-full px-8 py-3.5 font-semibold text-sm transition-all duration-300 hover:-translate-y-0.5"
              style={{ backgroundColor: "#C4622D", color: "#ffffff", boxShadow: "0 4px 20px rgba(196,98,45,0.4)" }}
            >
              Join waitlist — free
              <ArrowRight size={15} />
            </Link>
            <Link
              href="/#waitlist"
              className="inline-flex items-center justify-center gap-2 rounded-full px-8 py-3.5 font-semibold text-sm transition-all duration-300 hover:bg-white/20"
              style={{ border: "2px solid rgba(255,255,255,0.6)", color: "#ffffff" }}
            >
              See city progress
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}
