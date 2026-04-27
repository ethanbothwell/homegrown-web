"use client";

import Link from "next/link";
import { useAuth } from "@/lib/auth-context";
import { Button } from "@/components/ui/button";

export function Nav() {
  const { user, logout, loading } = useAuth();

  return (
    <header className="sticky top-0 z-50" style={{ backgroundColor: "#2D5016" }}>
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5">
          <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M14 3C14 3 5 9 5 17C5 21.418 9.134 25 14 25C18.866 25 23 21.418 23 17C23 9 14 3 14 3Z" fill="#87A878"/>
            <path d="M14 8C14 8 9 12 9 17C9 19.761 11.239 22 14 22C16.761 22 19 19.761 19 17C19 12 14 8 14 8Z" fill="#FAF7F2"/>
            <path d="M14 11L14 24" stroke="#2D5016" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
          <span className="font-heading text-xl font-bold" style={{ color: "#FAF7F2" }}>
            HomeGrown
          </span>
        </Link>

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
