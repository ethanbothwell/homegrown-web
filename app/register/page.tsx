"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useAuth, WaitlistResult } from "@/lib/auth-context";
import { toast } from "sonner";
import { Role } from "@/lib/api";
import { Check, Copy } from "lucide-react";

const PRODUCE_IMAGE =
  "https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=1600&q=80";

const OREGON_CITIES = [
  "Portland",
  "Salem",
  "Corvallis",
  "Eugene",
  "Bend",
  "Medford",
  "Astoria",
  "Newport",
];

const OREGON_COUNTIES = [
  "Benton County",
  "Clackamas County",
  "Columbia County",
  "Deschutes County",
  "Jackson County",
  "Josephine County",
  "Lane County",
  "Lincoln County",
  "Linn County",
  "Marion County",
  "Multnomah County",
  "Polk County",
  "Tillamook County",
  "Washington County",
  "Yamhill County",
];

// ─── Share screen shown after successful registration ─────────────────────────

function ShareScreen({ result, name }: { result: WaitlistResult; name: string }) {
  const [copied, setCopied] = useState(false);
  const community = result.community ?? "your area";
  const position = result.waitlistPosition;
  const remaining = result.remaining ?? 0;
  const shareUrl = "https://homegrown-web.vercel.app";
  const shareText = remaining > 0
    ? `I just joined the HomeGrown waitlist in ${community}! We need ${remaining} more people to unlock local farm delivery. Join us at ${shareUrl}`
    : `HomeGrown just unlocked in ${community}! Get fresh seasonal produce delivered straight from local farms. Sign up at ${shareUrl}`;

  function copyLink() {
    navigator.clipboard.writeText(shareUrl).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  return (
    <div className="text-center">
      {/* Position badge */}
      {position && (
        <div
          className="inline-flex items-center justify-center w-20 h-20 rounded-full mb-5 mx-auto"
          style={{ backgroundColor: "rgba(45,80,22,0.08)", border: "2px solid rgba(45,80,22,0.2)" }}
        >
          <span className="font-heading font-bold" style={{ fontSize: "1.6rem", color: "#2D5016" }}>
            #{position}
          </span>
        </div>
      )}

      <h1 className="font-heading text-3xl font-bold mb-2" style={{ color: "#1a1a1a" }}>
        You're on the list!
      </h1>
      <p className="text-sm mb-1" style={{ color: "#6b6b6b" }}>
        Welcome, {name}. You're registered in{" "}
        <span className="font-semibold" style={{ color: "#2D5016" }}>{community}</span>.
      </p>

      {remaining > 0 ? (
        <>
          <p className="text-sm mb-6" style={{ color: "#6b6b6b" }}>
            <span className="font-bold text-base" style={{ color: "#C4622D" }}>{remaining}</span> more people needed to unlock HomeGrown in {community}.
          </p>

          {/* Progress bar */}
          <div className="mb-6">
            <div className="h-2 rounded-full overflow-hidden mb-1.5" style={{ backgroundColor: "#e8e2d9" }}>
              <div
                className="h-full rounded-full transition-all duration-1000"
                style={{
                  backgroundColor: "#2D5016",
                  width: position ? `${Math.min(100, (position / (position + remaining)) * 100)}%` : "5%",
                }}
              />
            </div>
            <p className="text-xs text-right" style={{ color: "#aaa" }}>
              {position ?? "?"} / {(position ?? 0) + remaining} members
            </p>
          </div>

          <p className="text-sm font-semibold mb-4" style={{ color: "#1a1a1a" }}>
            Help unlock {community} — share HomeGrown:
          </p>
        </>
      ) : (
        <p className="text-sm mb-6" style={{ color: "#6b6b6b" }}>
          Your community has hit the threshold. HomeGrown is now live in {community}.
        </p>
      )}

      {/* Share buttons */}
      <div className="flex flex-col gap-3 mb-6">
        <a
          href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 w-full rounded-full py-3 font-semibold text-sm transition-all duration-200 hover:-translate-y-0.5"
          style={{ backgroundColor: "#1DA1F2", color: "#fff" }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.746l7.73-8.835L1.254 2.25H8.08l4.253 5.622 5.911-5.622Zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
          Share on X
        </a>

        <button
          onClick={copyLink}
          className="flex items-center justify-center gap-2 w-full rounded-full py-3 font-semibold text-sm transition-all duration-200 border-2 hover:-translate-y-0.5"
          style={{ borderColor: "#2D5016", color: "#2D5016", backgroundColor: "transparent" }}
        >
          {copied ? <Check size={16} /> : <Copy size={16} />}
          {copied ? "Copied!" : "Copy invite link"}
        </button>
      </div>

      <Link
        href="/#waitlist"
        className="text-sm font-medium hover:underline"
        style={{ color: "#6b6b6b" }}
      >
        See your community's progress →
      </Link>
    </div>
  );
}

// ─── Registration form ────────────────────────────────────────────────────────

function RegisterForm() {
  const params = useSearchParams();
  const { register } = useAuth();

  const defaultRole = (params.get("role") as Role | null) ?? "Buyer";
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<Role>(defaultRole);
  const [community, setCommunity] = useState("");
  const [loading, setLoading] = useState(false);
  const [waitlistResult, setWaitlistResult] = useState<WaitlistResult | null>(null);

  async function handleSubmit(e: React.SyntheticEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    try {
      const fromDemo = params.get("from") === "demo";
      const result = await register(email, password, name, role, community || undefined);
      if (result.community) {
        setWaitlistResult(result);
      } else if (fromDemo) {
        // Came from demo — send to waitlist section
        window.location.href = "/#waitlist";
      } else {
        toast.success("Account created.");
        window.location.href = role === "Farmer" ? "/dashboard" : "/farms";
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Registration failed.");
    } finally {
      setLoading(false);
    }
  }

  if (waitlistResult) {
    return <ShareScreen result={waitlistResult} name={name} />;
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
            className="rounded-lg py-3 px-3 text-center transition-all duration-200 border-2"
            style={{
              borderColor: role === r ? "#2D5016" : "#e8e2d9",
              backgroundColor: role === r ? "rgba(45,80,22,0.06)" : "#ffffff",
              color: "#1a1a1a",
            }}
          >
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
        {/* Name */}
        <div>
          <label className="block text-sm font-bold mb-1.5" style={{ color: "#1a1a1a" }}>
            Full name
          </label>
          <input
            type="text"
            autoComplete="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="w-full rounded-lg px-4 py-3 text-sm outline-none transition-colors"
            style={{ border: "1.5px solid #e8e2d9", color: "#1a1a1a", backgroundColor: "#ffffff" }}
            onFocus={(e) => (e.target.style.borderColor = "#2D5016")}
            onBlur={(e) => (e.target.style.borderColor = "#e8e2d9")}
          />
        </div>

        {/* Email */}
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
            style={{ border: "1.5px solid #e8e2d9", color: "#1a1a1a", backgroundColor: "#ffffff" }}
            onFocus={(e) => (e.target.style.borderColor = "#2D5016")}
            onBlur={(e) => (e.target.style.borderColor = "#e8e2d9")}
          />
        </div>

        {/* Password */}
        <div>
          <label className="block text-sm font-bold mb-1.5" style={{ color: "#1a1a1a" }}>
            Password
          </label>
          <input
            type="password"
            autoComplete="new-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={8}
            className="w-full rounded-lg px-4 py-3 text-sm outline-none transition-colors"
            style={{ border: "1.5px solid #e8e2d9", color: "#1a1a1a", backgroundColor: "#ffffff" }}
            onFocus={(e) => (e.target.style.borderColor = "#2D5016")}
            onBlur={(e) => (e.target.style.borderColor = "#e8e2d9")}
          />
        </div>

        {/* Community selector */}
        <div>
          <label className="block text-sm font-bold mb-1.5" style={{ color: "#1a1a1a" }}>
            Your area <span className="font-normal" style={{ color: "#6b6b6b" }}>(optional)</span>
          </label>
          <select
            value={community}
            onChange={(e) => setCommunity(e.target.value)}
            className="w-full rounded-lg px-4 py-3 text-sm outline-none transition-colors appearance-none"
            style={{
              border: "1.5px solid #e8e2d9",
              color: community ? "#1a1a1a" : "#9b9b9b",
              backgroundColor: "#ffffff",
            }}
            onFocus={(e) => (e.target.style.borderColor = "#2D5016")}
            onBlur={(e) => (e.target.style.borderColor = "#e8e2d9")}
          >
            <option value="">Select your city or county…</option>
            <optgroup label="Cities">
              {OREGON_CITIES.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </optgroup>
            <optgroup label="Counties">
              {OREGON_COUNTIES.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </optgroup>
          </select>
          <p className="text-xs mt-1.5" style={{ color: "#aaa" }}>
            Helps us show your community's progress toward unlocking HomeGrown.
          </p>
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
