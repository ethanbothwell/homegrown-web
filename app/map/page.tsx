"use client";

import dynamic from "next/dynamic";
import { Nav } from "@/components/nav";

// react-leaflet requires the DOM — no SSR
const FarmMap = dynamic(() => import("@/components/farm-map"), {
  ssr: false,
  loading: () => (
    <div className="flex-1 flex items-center justify-center" style={{ backgroundColor: "#FAF7F2" }}>
      <div className="text-center">
        <div className="text-4xl mb-3 animate-bounce">🗺</div>
        <p className="text-sm font-medium" style={{ color: "#9b9b9b" }}>Loading map…</p>
      </div>
    </div>
  ),
});

export default function MapPage() {
  return (
    <div className="flex flex-col" style={{ height: "100svh", overflow: "hidden" }}>
      <Nav />
      <FarmMap />
    </div>
  );
}
