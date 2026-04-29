"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { Nav } from "@/components/nav";
import { products as productsApi, Product } from "@/lib/api";
import { Search, SlidersHorizontal, Package } from "lucide-react";

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

// ─── Product card ────────────────────────────────────────────────────────────

function ProductCard({ product }: { product: Product }) {
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
          href={`/farms/${product.farmId}`}
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

          <Link href={`/farms/${product.farmId}`}>
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
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [loading, setLoading]         = useState(true);
  const [error, setError]             = useState("");
  const [search, setSearch]           = useState("");
  const [category, setCategory]       = useState("All");
  const [sort, setSort]               = useState("name");
  const [inStockOnly, setInStockOnly] = useState(false);

  const load = useCallback(async () => {
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
  }, [category, inStockOnly, sort]);

  useEffect(() => { load(); }, [load]);

  // Client-side search filter (runs on top of server-filtered results)
  const filtered = search.trim()
    ? allProducts.filter((p) => {
        const q = search.toLowerCase();
        return (
          p.name.toLowerCase().includes(q) ||
          p.farmName.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q) ||
          p.description?.toLowerCase().includes(q) ||
          p.tags?.toLowerCase().includes(q)
        );
      })
    : allProducts;

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
            {filtered.map((p) => <ProductCard key={p.id} product={p} />)}
          </div>
        )}
      </div>
    </div>
  );
}
