"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { toast } from "sonner";
import { Role } from "@/lib/api";

const PRODUCE_IMAGE =
  "https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=1600&q=80";

function RegisterForm() {
  const router = useRouter();
  const params = useSearchParams();
  const { register } = useAuth();

  const defaultRole = (params.get("role") as Role | null) ?? "Buyer";
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<Role>(defaultRole);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.SyntheticEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    try {
      await register(email, password, name, role);
      toast.success("Account created.");
      router.push(role === "Farmer" ? "/dashboard" : "/farms");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Registration failed.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <h1 className="font-heading text-3xl font-bold mb-1" style={{ color: "#1a1a1a" }}>
        Create account
      </h1>
      <p className="text-sm mb-6" style={{ color: "#6b6b6b" }}>
        Join HomeGrown for free.
      </p>

      {/* Role toggle */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        {(["Buyer", "Farmer"] as Role[]).map((r) => (
          <button
            key={r}
            type="button"
            onClick={() => setRole(r)}
            className="rounded-lg py-4 px-3 text-center transition-all duration-200 border-2"
            style={{
              borderColor: role === r ? "#2D5016" : "#e8e2d9",
              backgroundColor: role === r ? "rgba(45,80,22,0.06)" : "#ffffff",
              color: "#1a1a1a",
            }}
          >
            <span className="text-2xl block mb-1">{r === "Buyer" ? "🛒" : "🌾"}</span>
            <span className="text-sm font-bold block">
              {r === "Buyer" ? "I'm a buyer" : "I'm a farmer"}
            </span>
            <span className="text-xs block mt-0.5" style={{ color: "#6b6b6b" }}>
              {r === "Buyer" ? "Shop local farms" : "Sell your produce"}
            </span>
          </button>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {[
          { id: "name", label: "Full name", type: "text", value: name, setter: setName, auto: "name" },
          { id: "email", label: "Email", type: "email", value: email, setter: setEmail, auto: "email" },
          { id: "password", label: "Password", type: "password", value: password, setter: setPassword, auto: "new-password" },
        ].map((f) => (
          <div key={f.id}>
            <label className="block text-sm font-bold mb-1.5" style={{ color: "#1a1a1a" }}>
              {f.label}
            </label>
            <input
              id={f.id}
              type={f.type}
              autoComplete={f.auto}
              value={f.value}
              onChange={(e) => f.setter(e.target.value)}
              required
              minLength={f.id === "password" ? 6 : undefined}
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
        ))}

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
          {loading ? "Creating account…" : "Create account"}
        </button>
      </form>

      <p className="text-sm mt-6 text-center" style={{ color: "#6b6b6b" }}>
        Already have an account?{" "}
        <Link href="/login" className="font-bold hover:underline" style={{ color: "#2D5016" }}>
          Sign in
        </Link>
      </p>
    </>
  );
}

export default function RegisterPage() {
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
              "To eat is a necessity, but to eat intelligently is an art."
            </blockquote>
            <cite className="text-sm" style={{ color: "rgba(255,255,255,0.6)" }}>
              — François de La Rochefoucauld
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

          <Suspense>
            <RegisterForm />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
