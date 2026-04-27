"use client";

import { useRef, useState, useEffect } from "react";
import Link from "next/link";
import { useAuth } from "@/lib/auth-context";
import { Button } from "@/components/ui/button";
import { ChevronDown, Menu, X } from "lucide-react";

export function Nav() {
  const { user, logout, loading } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close logo dropdown on outside click
  useEffect(() => {
    function handle(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handle);
    return () => document.removeEventListener("mousedown", handle);
  }, []);

  // Close everything on Escape
  useEffect(() => {
    function handle(e: KeyboardEvent) {
      if (e.key === "Escape") { setDropdownOpen(false); setMobileOpen(false); }
    }
    document.addEventListener("keydown", handle);
    return () => document.removeEventListener("keydown", handle);
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  const navLinks = [
    { label: "Home", href: "/" },
    { label: "Browse Farms", href: "/farms" },
    ...(user?.role === "Farmer" ? [{ label: "Dashboard", href: "/dashboard" }] : []),
    ...(user?.role === "Buyer" ? [{ label: "My Subscriptions", href: "/my-subscriptions" }] : []),
  ];

  return (
    <>
      <header className="sticky top-0 z-50" style={{ backgroundColor: "#2D5016" }}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">

          {/* ── Logo — desktop dropdown / mobile home link ── */}
          <div ref={dropdownRef} className="relative">
            {/* Desktop: clickable dropdown trigger */}
            <button
              onClick={() => setDropdownOpen((v) => !v)}
              className="hidden md:flex items-center gap-2 rounded-lg px-2 py-1.5 transition-colors hover:bg-white/10 focus:outline-none"
              aria-haspopup="true"
              aria-expanded={dropdownOpen}
            >
              <LogoSvg />
              <span className="font-heading text-xl font-bold" style={{ color: "#FAF7F2" }}>
                HomeGrown
              </span>
              <ChevronDown
                className="h-4 w-4 transition-transform duration-200"
                style={{ color: "rgba(250,247,242,0.7)", transform: dropdownOpen ? "rotate(180deg)" : "rotate(0deg)" }}
              />
            </button>

            {/* Mobile: plain home link */}
            <Link href="/" className="flex md:hidden items-center gap-2 px-1 py-1.5">
              <LogoSvg />
              <span className="font-heading text-xl font-bold" style={{ color: "#FAF7F2" }}>
                HomeGrown
              </span>
            </Link>

            {/* Desktop dropdown */}
            {dropdownOpen && (
              <div
                className="absolute left-0 top-full mt-2 w-52 rounded-xl overflow-hidden hidden md:block"
                style={{
                  backgroundColor: "#1e3a0e",
                  boxShadow: "0 8px 32px rgba(0,0,0,0.35)",
                  border: "1px solid rgba(255,255,255,0.1)",
                }}
              >
                <SectionLabel>Navigate</SectionLabel>
                {navLinks.map((link) => (
                  <DropdownLink key={link.href} href={link.href} onClick={() => setDropdownOpen(false)}>
                    {link.label}
                  </DropdownLink>
                ))}
                {!user && (
                  <>
                    <DropdownLink href="/login" onClick={() => setDropdownOpen(false)}>Sign In</DropdownLink>
                    <DropdownLink href="/register" onClick={() => setDropdownOpen(false)}>Join Free</DropdownLink>
                  </>
                )}
                {user && (
                  <>
                    <div className="mx-4 my-2" style={{ borderTop: "1px solid rgba(255,255,255,0.1)" }} />
                    <SectionLabel>Account</SectionLabel>
                    <div className="px-4 pb-2 text-xs truncate" style={{ color: "rgba(250,247,242,0.45)" }}>
                      {user.name}
                    </div>
                    <button
                      onClick={() => { setDropdownOpen(false); logout(); }}
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

          {/* ── Desktop right nav ── */}
          <nav className="hidden md:flex items-center gap-1">
            <Link href="/farms">
              <Button variant="ghost" size="sm" className="font-normal hover:bg-white/10" style={{ color: "rgba(250,247,242,0.85)" }}>
                Browse Farms
              </Button>
            </Link>
            {loading ? null : user ? (
              <>
                {user.role === "Farmer" && (
                  <Link href="/dashboard">
                    <Button variant="ghost" size="sm" className="font-normal hover:bg-white/10" style={{ color: "rgba(250,247,242,0.85)" }}>
                      Dashboard
                    </Button>
                  </Link>
                )}
                {user.role === "Buyer" && (
                  <Link href="/my-subscriptions">
                    <Button variant="ghost" size="sm" className="font-normal hover:bg-white/10" style={{ color: "rgba(250,247,242,0.85)" }}>
                      My Subscriptions
                    </Button>
                  </Link>
                )}
                <span className="mx-1" style={{ color: "rgba(250,247,242,0.3)" }}>|</span>
                <Button variant="ghost" size="sm" onClick={logout} className="font-normal hover:bg-white/10" style={{ color: "rgba(250,247,242,0.85)" }}>
                  Sign out
                </Button>
              </>
            ) : (
              <>
                <Link href="/login">
                  <Button variant="ghost" size="sm" className="font-normal hover:bg-white/10" style={{ color: "rgba(250,247,242,0.85)" }}>
                    Sign in
                  </Button>
                </Link>
                <Link href="/register">
                  <Button size="sm" className="ml-1 rounded-full px-5 font-semibold" style={{ backgroundColor: "#C4622D", color: "#FAF7F2" }}>
                    Join Free
                  </Button>
                </Link>
              </>
            )}
          </nav>

          {/* ── Mobile hamburger ── */}
          <button
            className="md:hidden flex items-center justify-center w-10 h-10 rounded-lg transition-colors hover:bg-white/10"
            onClick={() => setMobileOpen((v) => !v)}
            aria-label="Toggle menu"
          >
            {mobileOpen
              ? <X className="h-5 w-5" style={{ color: "#FAF7F2" }} />
              : <Menu className="h-5 w-5" style={{ color: "#FAF7F2" }} />
            }
          </button>
        </div>
      </header>

      {/* ── Mobile full-screen menu ── */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 md:hidden flex flex-col"
          style={{ backgroundColor: "#1e3a0e", top: "64px" }}
        >
          <nav className="flex-1 overflow-y-auto px-6 py-8 space-y-1">
            <p className="text-xs font-bold tracking-widest uppercase mb-4" style={{ color: "rgba(212,169,106,0.8)" }}>
              Navigate
            </p>
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="block py-3.5 text-lg font-medium border-b transition-colors hover:text-white"
                style={{ color: "rgba(250,247,242,0.85)", borderColor: "rgba(255,255,255,0.08)" }}
              >
                {link.label}
              </Link>
            ))}

            {!loading && !user && (
              <>
                <Link
                  href="/login"
                  onClick={() => setMobileOpen(false)}
                  className="block py-3.5 text-lg font-medium border-b transition-colors hover:text-white"
                  style={{ color: "rgba(250,247,242,0.85)", borderColor: "rgba(255,255,255,0.08)" }}
                >
                  Sign In
                </Link>
                <div className="pt-6">
                  <Link href="/register" onClick={() => setMobileOpen(false)}>
                    <button
                      className="w-full rounded-full py-3.5 font-semibold text-base"
                      style={{ backgroundColor: "#C4622D", color: "#FAF7F2" }}
                    >
                      Join Free
                    </button>
                  </Link>
                </div>
              </>
            )}

            {!loading && user && (
              <>
                <div className="pt-8">
                  <p className="text-xs font-bold tracking-widest uppercase mb-3" style={{ color: "rgba(212,169,106,0.8)" }}>
                    Account
                  </p>
                  <p className="text-sm mb-4" style={{ color: "rgba(250,247,242,0.5)" }}>{user.name}</p>
                  <button
                    onClick={() => { setMobileOpen(false); logout(); }}
                    className="w-full rounded-full py-3.5 font-semibold text-base border-2"
                    style={{ borderColor: "rgba(250,247,242,0.3)", color: "#FAF7F2", backgroundColor: "transparent" }}
                  >
                    Sign out
                  </button>
                </div>
              </>
            )}
          </nav>
        </div>
      )}
    </>
  );
}

// ── Shared sub-components ──────────────────────────────────────────────────

function LogoSvg() {
  return (
    <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M14 3C14 3 5 9 5 17C5 21.418 9.134 25 14 25C18.866 25 23 21.418 23 17C23 9 14 3 14 3Z" fill="#87A878"/>
      <path d="M14 8C14 8 9 12 9 17C9 19.761 11.239 22 14 22C16.761 22 19 19.761 19 17C19 12 14 8 14 8Z" fill="#FAF7F2"/>
      <path d="M14 11L14 24" stroke="#2D5016" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="px-4 pt-3 pb-1.5 text-xs font-bold tracking-widest uppercase" style={{ color: "rgba(212,169,106,0.8)" }}>
      {children}
    </div>
  );
}

function DropdownLink({ href, onClick, children }: { href: string; onClick: () => void; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className="block px-4 py-2.5 text-sm transition-colors hover:bg-white/10"
      style={{ color: "rgba(250,247,242,0.88)" }}
    >
      {children}
    </Link>
  );
}
