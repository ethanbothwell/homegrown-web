"use client";

import { useRef, useState, useEffect } from "react";
import Link from "next/link";
import { useAuth } from "@/lib/auth-context";
import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";

export function Nav() {
  const { user, logout, loading } = useAuth();
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    function handle(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handle);
    return () => document.removeEventListener("mousedown", handle);
  }, []);

  // Close on Escape
  useEffect(() => {
    function handle(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("keydown", handle);
    return () => document.removeEventListener("keydown", handle);
  }, []);

  const navLinks = [
    { label: "Home", href: "/" },
    { label: "Browse Farms", href: "/farms" },
    ...(user?.role === "Farmer"
      ? [{ label: "Dashboard", href: "/dashboard" }]
      : []),
    ...(user?.role === "Buyer"
      ? [{ label: "My Subscriptions", href: "/my-subscriptions" }]
      : []),
    ...(!user
      ? [
          { label: "Sign In", href: "/login" },
          { label: "Join Free", href: "/register" },
        ]
      : []),
  ];

  return (
    <header className="sticky top-0 z-50" style={{ backgroundColor: "#2D5016" }}>
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">

        {/* Logo — dropdown trigger */}
        <div ref={menuRef} className="relative">
          <button
            onClick={() => setOpen((v) => !v)}
            className="flex items-center gap-2.5 rounded-lg px-2 py-1.5 transition-colors hover:bg-white/10 focus:outline-none"
            aria-haspopup="true"
            aria-expanded={open}
          >
            <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M14 3C14 3 5 9 5 17C5 21.418 9.134 25 14 25C18.866 25 23 21.418 23 17C23 9 14 3 14 3Z" fill="#87A878"/>
              <path d="M14 8C14 8 9 12 9 17C9 19.761 11.239 22 14 22C16.761 22 19 19.761 19 17C19 12 14 8 14 8Z" fill="#FAF7F2"/>
              <path d="M14 11L14 24" stroke="#2D5016" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
            <span className="font-heading text-xl font-bold" style={{ color: "#FAF7F2" }}>
              HomeGrown
            </span>
            <ChevronDown
              className="h-4 w-4 transition-transform duration-200"
              style={{
                color: "rgba(250,247,242,0.7)",
                transform: open ? "rotate(180deg)" : "rotate(0deg)",
              }}
            />
          </button>

          {/* Dropdown */}
          {open && (
            <div
              className="absolute left-0 top-full mt-2 w-52 rounded-xl overflow-hidden"
              style={{
                backgroundColor: "#1e3a0e",
                boxShadow: "0 8px 32px rgba(0,0,0,0.35)",
                border: "1px solid rgba(255,255,255,0.1)",
              }}
            >
              {/* Divider label */}
              <div
                className="px-4 pt-3 pb-1.5 text-xs font-bold tracking-widest uppercase"
                style={{ color: "rgba(212,169,106,0.8)" }}
              >
                Navigate
              </div>

              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className="block px-4 py-2.5 text-sm transition-colors hover:bg-white/10"
                  style={{ color: "rgba(250,247,242,0.88)" }}
                >
                  {link.label}
                </Link>
              ))}

              {user && (
                <>
                  <div
                    className="mx-4 my-2"
                    style={{ borderTop: "1px solid rgba(255,255,255,0.1)" }}
                  />
                  <div
                    className="px-4 pb-1.5 text-xs font-bold tracking-widest uppercase"
                    style={{ color: "rgba(212,169,106,0.8)" }}
                  >
                    Account
                  </div>
                  <div
                    className="px-4 pb-2 text-xs truncate"
                    style={{ color: "rgba(250,247,242,0.45)" }}
                  >
                    {user.name}
                  </div>
                  <button
                    onClick={() => { setOpen(false); logout(); }}
                    className="block w-full text-left px-4 py-2.5 text-sm transition-colors hover:bg-white/10 mb-1"
                    style={{ color: "rgba(250,247,242,0.7)" }}
                  >
                    Sign out
                  </button>
                </>
              )}
            </div>
          )}
        </div>

        {/* Right nav */}
        <nav className="flex items-center gap-1">
          <Link href="/farms">
            <Button
              variant="ghost"
              size="sm"
              className="font-normal hover:bg-white/10"
              style={{ color: "rgba(250,247,242,0.85)" }}
            >
              Browse Farms
            </Button>
          </Link>

          {loading ? null : user ? (
            <>
              {user.role === "Farmer" && (
                <Link href="/dashboard">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="font-normal hover:bg-white/10"
                    style={{ color: "rgba(250,247,242,0.85)" }}
                  >
                    Dashboard
                  </Button>
                </Link>
              )}
              {user.role === "Buyer" && (
                <Link href="/my-subscriptions">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="font-normal hover:bg-white/10"
                    style={{ color: "rgba(250,247,242,0.85)" }}
                  >
                    My Subscriptions
                  </Button>
                </Link>
              )}
              <span className="mx-1" style={{ color: "rgba(250,247,242,0.3)" }}>|</span>
              <Button
                variant="ghost"
                size="sm"
                onClick={logout}
                className="font-normal hover:bg-white/10"
                style={{ color: "rgba(250,247,242,0.85)" }}
              >
                Sign out
              </Button>
            </>
          ) : (
            <>
              <Link href="/login">
                <Button
                  variant="ghost"
                  size="sm"
                  className="font-normal hover:bg-white/10"
                  style={{ color: "rgba(250,247,242,0.85)" }}
                >
                  Sign in
                </Button>
              </Link>
              <Link href="/register">
                <Button
                  size="sm"
                  className="ml-1 rounded-full px-5 font-semibold"
                  style={{ backgroundColor: "#C4622D", color: "#FAF7F2" }}
                >
                  Join Free
                </Button>
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
