"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { Nav } from "@/components/nav";
import { products as productsApi, Product } from "@/lib/api";
import { Search, SlidersHorizontal, Package, ArrowRight } from "lucide-react";
import { useAuth } from "@/lib/auth-context";

const CATEGORIES = [
  "All",
  "Farm Box",
  "Eggs",
  "Bread",
  "Pastries",
  "Produce",
  "Dairy",
  "Meat",
  "Honey",
];

const SORT_OPTIONS = [
  { value: "name",       label: "Name A–Z" },
  { value: "price_asc",  label: "Price: Low to High" },
  { value: "price_desc", label: "Price: High to Low" },
];

const CATEGORY_COLORS: Record<string, { bg: string; text: string }> = {
  "Farm Box": { bg: "#2D5016", text: "#FAF7F2" },
  "Eggs":     { bg: "#C4622D", text: "#FAF7F2" },
  "Bread":    { bg: "#8B6B3D", text: "#FAF7F2" },
  "Pastries": { bg: "#9B4E6B", text: "#FAF7F2" },
  "Produce":  { bg: "#4A7C3F", text: "#FAF7F2" },
  "Dairy":    { bg: "#5B8DB8", text: "#FAF7F2" },
  "Meat":     { bg: "#7A3B2E", text: "#FAF7F2" },
  "Honey":    { bg: "#B8860B", text: "#FAF7F2" },
};

// ─── Mock products (shown to unauthenticated visitors) ───────────────────────

const MOCK_PRODUCTS: Product[] = [
  {
    id: "mp1",
    farmId: "f1",
    farmName: "Sunridge Farm",
    name: "Dozen Pasture-Raised Eggs",
    category: "Eggs",
    price: 8.00,
    unit: "dozen",
    imageUrl: "https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f?w=400&q=80",
    description: "Rich orange yolks from hens raised on open pasture.",
    inStock: true,
  },
  {
    id: "mp2",
    farmId: "f1",
    farmName: "Sunridge Farm",
    name: "Weekly Veggie Box",
    category: "Farm Box",
    price: 45.00,
    unit: "box",
    imageUrl: "https://images.unsplash.com/photo-1540420773420-3366772f4999?w=400&q=80",
    description: "8–10 seasonal vegetables, harvested the morning of delivery.",
    inStock: true,
  },
  {
    id: "mp3",
    farmId: "f2",
    farmName: "Willamette Bakehouse",
    name: "Country Sourdough Loaf",
    category: "Bread",
    price: 12.00,
    unit: "loaf",
    imageUrl: "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400&q=80",
    description: "72-hour ferment with Oregon hard red wheat.",
    inStock: true,
  },
  {
    id: "mp4",
    farmId: "f2",
    farmName: "Willamette Bakehouse",
    name: "Croissant Box (6)",
    category: "Pastries",
    price: 18.00,
    unit: "box",
    imageUrl: "https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=400&q=80",
    description: "Laminated with local cultured butter. Baked fresh daily.",
    inStock: true,
  },
  {
    id: "mp5",
    farmId: "f3",
    farmName: "Cascade Creamery",
    name: "Raw Whole Milk",
    category: "Dairy",
    price: 14.00,
    unit: "gallon",
    imageUrl: "https://images.unsplash.com/photo-1550583724-b2692b85b150?w=400&q=80",
    description: "Non-homogenized, cream-top. Jersey cows on coastal pasture.",
    inStock: true,
  },
  {
    id: "mp6",
    farmId: "f4",
    farmName: "Blue Heron Orchard",
    name: "Mixed Heritage Apple Box",
    category: "Produce",
    price: 28.00,
    unit: "10 lb",
    imageUrl: "https://images.unsplash.com/photo-1506484381205-f7945653044d?w=400&q=80",
    description: "Cox's Orange Pippin, Gravenstein, Newtown Pippin and more.",
    inStock: true,
  },
];

// ─── Product card ────────────────────────────────────────────────────────────

function ProductCard({ product, farmHref }: { product: Product; farmHref: string }) {
  const colors = CATEGORY_COLORS[product.category] ?? { bg: "#2D5016", text: "#FAF7F2" };

  return (
    <div
      className="rounded-2xl overflow-hidden flex flex-col group transition-all duration-200 hover:-translate-y-1"
      style={{
        backgroundColor: "#ffffff",
        border: "1.5px solid #e8e2d9",
        boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
      }}
    >
      {/* Image area */}
      <div className="relative overflow-hidden" style={{ aspectRatio: "1/1", backgroundColor: "#f5f0e8" }}>
        {product.imageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={product.imageUrl}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center gap-2">
            <Package size={36} style={{ color: "#d0c8bc" }} />
            <span className="text-xs font-medium" style={{ color: "#c0b8b0" }}>
              {product.category}
            </span>
          </div>
        )}

        {/* Category badge */}
        <span
          className="absolute top-2.5 left-2.5 text-xs font-bold px-2.5 py-1 rounded-full"
          style={{ backgroundColor: colors.bg, color: colors.text }}
        >
          {product.category}
        </span>

        {/* Sold out overlay */}
        {!product.inStock && (
          <div
            className="absolute inset-0 flex items-center justify-center"
            style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
          >
            <span
              className="font-bold text-sm px-3 py-1 rounded-full"
              style={{ backgroundColor: "rgba(0,0,0,0.7)", color: "#ffffff" }}
            >
              Sold out
            </span>
          </div>
        )}
      </div>

      {/* Info */}
      <div className="p-4 flex flex-col flex-1">
        <Link
          href={farmHref}
          className="text-xs mb-1 hover:underline truncate"
          style={{ color: "#9b9b9b" }}
        >
          {product.farmName}
        </Link>

        <h3 className="font-semibold text-sm leading-snug" style={{ color: "#1a1a1a" }}>
          {product.name}
        </h3>

        {product.description && (
          <p
            className="text-xs mt-1 leading-relaxed"
            style={{
              color: "#6b6b6b",
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
            }}
          >
            {product.description}
          </p>
        )}

        {/* Price + CTA */}
        <div
          className="flex items-center justify-between mt-3 pt-3"
          style={{ borderTop: "1px solid #f0ebe3", marginTop: "auto" }}
        >
          <div>
            <span className="font-bold text-base" style={{ color: "#1a1a1a" }}>
              ${product.price.toFixed(2)}
            </span>
            {product.unit && (
              <span className="text-xs ml-1" style={{ color: "#9b9b9b" }}>
                / {product.unit}
              </span>
            )}
          </div>

          <Link href={farmHref}>
            <button
              disabled={!product.inStock}
              className="text-xs font-semibold px-3 py-1.5 rounded-full transition-all duration-200 hover:-translate-y-0.5 disabled:opacity-40 disabled:cursor-not-allowed disabled:transform-none"
              style={{
                backgroundColor: product.inStock ? "#C4622D" : "#e8e2d9",
                color: product.inStock ? "#ffffff" : "#aaa",
              }}
            >
              View farm
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}

// ─── Skeleton loader ─────────────────────────────────────────────────────────

function SkeletonCard() {
  return (
    <div className="rounded-2xl overflow-hidden" style={{ border: "1.5px solid #e8e2d9" }}>
      <div className="animate-pulse" style={{ aspectRatio: "1/1", backgroundColor: "#ede8e0" }} />
      <div className="p-4 space-y-2">
        <div className="h-2.5 w-1/2 rounded-full animate-pulse" style={{ backgroundColor: "#ede8e0" }} />
        <div className="h-3.5 w-3/4 rounded-full animate-pulse" style={{ backgroundColor: "#ede8e0" }} />
        <div className="h-2.5 w-full rounded-full animate-pulse" style={{ backgroundColor: "#ede8e0" }} />
      </div>
    </div>
  );
}

// ─── Page ────────────────────────────────────────────────────────────────────

export default function MarketplacePage() {
  const { user, loading: authLoading } = useAuth();
  const isPreview = !authLoading && !user;

  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [loading, setLoading]         = useState(true);
  const [error, setError]             = useState("");
  const [search, setSearch]           = useState("");
  const [category, setCategory]       = useState("All");
  const [sort, setSort]               = useState("name");
  const [inStockOnly, setInStockOnly] = useState(false);

  const load = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    try {
      const data = await productsApi.list({
        category:    category !== "All" ? category : undefined,
        inStockOnly: inStockOnly || undefined,
        sort,
      });
      setAllProducts(data);
      setError("");
    } catch {
      setError("Could not load products. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [category, inStockOnly, sort, user]);

  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      setAllProducts(MOCK_PRODUCTS);
      setLoading(false);
      return;
    }
    load();
  }, [user, authLoading, load]);

  // Filtering: text search always client-side; category/sort/inStock also client-side in preview mode
  const filtered = (() => {
    let list = allProducts;

    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter((p) =>
        p.name.toLowerCase().includes(q) ||
        p.farmName.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.description?.toLowerCase().includes(q) ||
        p.tags?.toLowerCase().includes(q)
      );
    }

    if (isPreview) {
      if (category !== "All") list = list.filter((p) => p.category === category);
      if (inStockOnly) list = list.filter((p) => p.inStock);
      list = [...list].sort((a, b) =>
        sort === "price_asc"  ? a.price - b.price :
        sort === "price_desc" ? b.price - a.price :
        a.name.localeCompare(b.name)
      );
    }

    return list;
  })();

  return (
    <div style={{ minHeight: "100svh", backgroundColor: "#FAF7F2" }}>
      <Nav />

      {/* ─── Hero header ─── */}
      <div
        className="py-14 px-6 text-center"
        style={{ backgroundColor: "#FAF7F2", borderBottom: "1px solid #e8e2d9" }}
      >
        <span
          className="inline-block text-xs font-bold tracking-widest uppercase mb-3 px-3 py-1 rounded-full"
          style={{ backgroundColor: "rgba(45,80,22,0.08)", color: "#2D5016" }}
        >
          Marketplace
        </span>
        <h1
          className="font-heading font-bold mb-3"
          style={{ fontSize: "clamp(2rem,5vw,3rem)", color: "#1a2e0a" }}
        >
          Fresh from local farms.
        </h1>
        <p className="text-base max-w-lg mx-auto" style={{ color: "#6b6b6b", lineHeight: 1.7 }}>
          Farm boxes, eggs, bread, pastries and more — direct from growers in your community.
        </p>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-8">

        {/* Preview banner */}
        {isPreview && (
          <div
            className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 rounded-xl px-5 py-4 mb-8"
            style={{ backgroundColor: "rgba(45,80,22,0.06)", border: "1.5px solid rgba(45,80,22,0.15)" }}
          >
            <p className="text-sm" style={{ color: "#3A3530" }}>
              <span className="font-semibold" style={{ color: "#2D5016" }}>Preview mode</span>
              {" "}— sample products from Corvallis-area farms. Sign in to browse live listings.
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

        {/* ─── Filter bar ─── */}
        <div className="flex flex-col sm:flex-row gap-3 mb-5">
          {/* Search */}
          <div className="relative flex-1">
            <Search
              size={15}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
              style={{ color: "#aaa" }}
            />
            <input
              type="text"
              placeholder="Search products, farms…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl text-sm outline-none transition-colors"
              style={{ border: "1.5px solid #e8e2d9", backgroundColor: "#ffffff", color: "#1a1a1a" }}
              onFocus={(e) => (e.target.style.borderColor = "#2D5016")}
              onBlur={(e)  => (e.target.style.borderColor = "#e8e2d9")}
            />
          </div>

          {/* Sort */}
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="px-4 py-2.5 rounded-xl text-sm outline-none appearance-none cursor-pointer"
            style={{
              border: "1.5px solid #e8e2d9",
              backgroundColor: "#ffffff",
              color: "#1a1a1a",
              minWidth: "190px",
            }}
          >
            {SORT_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>

          {/* In-stock toggle */}
          <button
            onClick={() => setInStockOnly((v) => !v)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200"
            style={{
              border:           `1.5px solid ${inStockOnly ? "#2D5016" : "#e8e2d9"}`,
              backgroundColor:  inStockOnly ? "rgba(45,80,22,0.07)" : "#ffffff",
              color:            inStockOnly ? "#2D5016" : "#6b6b6b",
            }}
          >
            <SlidersHorizontal size={14} />
            In stock only
          </button>
        </div>

        {/* ─── Category pills ─── */}
        <div className="flex gap-2 flex-wrap mb-8">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className="px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-200"
              style={{
                backgroundColor: category === cat ? "#2D5016" : "#ffffff",
                color:           category === cat ? "#FAF7F2" : "#6b6b6b",
                border:          `1.5px solid ${category === cat ? "#2D5016" : "#e8e2d9"}`,
              }}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* ─── Result count ─── */}
        {!loading && !error && (
          <p className="text-sm mb-5" style={{ color: "#aaa" }}>
            {filtered.length} {filtered.length === 1 ? "product" : "products"}
            {category !== "All" && ` in ${category}`}
            {search.trim() && ` matching "${search.trim()}"`}
          </p>
        )}

        {/* ─── Grid ─── */}
        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} />)}
          </div>
        ) : error ? (
          <p className="text-center py-24 text-sm" style={{ color: "#aaa" }}>{error}</p>
        ) : filtered.length === 0 ? (
          <div className="text-center py-24">
            <Package size={44} className="mx-auto mb-4" style={{ color: "#d0c8bc" }} />
            <p className="font-semibold text-base" style={{ color: "#1a1a1a" }}>No products found</p>
            <p className="text-sm mt-1" style={{ color: "#aaa" }}>
              Try a different category or clear the search.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {filtered.map((p) => (
              <ProductCard
                key={p.id}
                product={p}
                farmHref={isPreview ? "/register" : `/farms/${p.farmId}`}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
