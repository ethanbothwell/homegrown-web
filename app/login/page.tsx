"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { toast } from "sonner";
import { useEffect } from "react";

const PRODUCE_IMAGE =
  "https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=1600&q=80";

export default function LoginPage() {
  const router = useRouter();
  const { user, login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      router.push(user.role === "Farmer" ? "/dashboard" : "/farms");
    }
  }, [user, router]);

  async function handleSubmit(e: React.SyntheticEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    try {
      await login(email, password);
      toast.success("Welcome back.");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Login failed.");
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen">
      {/* Left image panel */}
      <div
        className="hidden lg:flex lg:flex-col lg:w-1/2 relative"
        style={{
          backgroundImage: `url('${PRODUCE_IMAGE}')`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(160deg, rgba(20,40,10,0.65) 0%, rgba(0,0,0,0.45) 100%)",
          }}
        />
        <div className="relative z-10 flex flex-col justify-between h-full p-10">
          <Link href="/" className="flex items-center gap-2.5">
            <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
              <path d="M14 3C14 3 5 9 5 17C5 21.418 9.134 25 14 25C18.866 25 23 21.418 23 17C23 9 14 3 14 3Z" fill="#87A878"/>
              <path d="M14 8C14 8 9 12 9 17C9 19.761 11.239 22 14 22C16.761 22 19 19.761 19 17C19 12 14 8 14 8Z" fill="#FAF7F2"/>
              <path d="M14 11L14 24" stroke="#2D5016" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
            <span className="font-heading text-xl font-bold text-white">HomeGrown</span>
          </Link>
          <div>
            <blockquote
              className="font-heading italic text-white mb-2"
              style={{ fontSize: "1.4rem", lineHeight: 1.5 }}
            >
              "The farmer is the only man in our economy who buys everything at retail, sells everything at wholesale, and pays the freight both ways."
            </blockquote>
            <cite className="text-sm" style={{ color: "rgba(255,255,255,0.6)" }}>
              — John F. Kennedy
            </cite>
          </div>
        </div>
      </div>

      {/* Right form panel */}
      <div className="flex flex-1 items-center justify-center px-8 py-12 bg-white">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <div className="lg:hidden mb-8">
            <Link href="/" className="flex items-center gap-2">
              <svg width="24" height="24" viewBox="0 0 28 28" fill="none">
                <path d="M14 3C14 3 5 9 5 17C5 21.418 9.134 25 14 25C18.866 25 23 21.418 23 17C23 9 14 3 14 3Z" fill="#87A878"/>
                <path d="M14 8C14 8 9 12 9 17C9 19.761 11.239 22 14 22C16.761 22 19 19.761 19 17C19 12 14 8 14 8Z" fill="#FAF7F2"/>
                <path d="M14 11L14 24" stroke="#2D5016" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
              <span className="font-heading text-xl font-bold" style={{ color: "#2D5016" }}>HomeGrown</span>
            </Link>
          </div>

          <h1 className="font-heading text-3xl font-bold mb-1" style={{ color: "#1a1a1a" }}>
            Welcome back
          </h1>
          <p className="text-sm mb-8" style={{ color: "#6b6b6b" }}>
            Sign in to your HomeGrown account.
          </p>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-bold mb-1.5" style={{ color: "#1a1a1a" }}>
                Email
              </label>
              <input
                type="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full rounded-lg px-4 py-3 text-sm outline-none transition-colors"
                style={{
                  border: "1.5px solid #e8e2d9",
                  color: "#1a1a1a",
                  backgroundColor: "#ffffff",
                }}
                onFocus={(e) => (e.target.style.borderColor = "#2D5016")}
                onBlur={(e) => (e.target.style.borderColor = "#e8e2d9")}
              />
            </div>
            <div>
              <label className="block text-sm font-bold mb-1.5" style={{ color: "#1a1a1a" }}>
                Password
              </label>
              <input
                type="password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full rounded-lg px-4 py-3 text-sm outline-none transition-colors"
                style={{
                  border: "1.5px solid #e8e2d9",
                  color: "#1a1a1a",
                  backgroundColor: "#ffffff",
                }}
                onFocus={(e) => (e.target.style.borderColor = "#2D5016")}
                onBlur={(e) => (e.target.style.borderColor = "#e8e2d9")}
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-full py-3 font-semibold text-sm transition-all duration-300 hover:-translate-y-0.5 disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none"
              style={{
                backgroundColor: "#C4622D",
                color: "#ffffff",
                boxShadow: "0 4px 16px rgba(196,98,45,0.3)",
              }}
            >
              {loading ? "Signing in…" : "Sign in"}
            </button>
          </form>

          <p className="text-sm mt-6 text-center" style={{ color: "#6b6b6b" }}>
            Don&apos;t have an account?{" "}
            <Link
              href="/register"
              className="font-bold hover:underline"
              style={{ color: "#2D5016" }}
            >
              Register free
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
