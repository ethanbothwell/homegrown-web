"use client";

import Link from "next/link";
import { useAuth } from "@/lib/auth-context";
import { Button } from "@/components/ui/button";

export function Nav() {
  const { user, logout, loading } = useAuth();

  return (
    <header className="border-b border-border bg-background/90 backdrop-blur-sm sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link
          href="/"
          className="font-heading text-xl font-bold text-foreground tracking-tight"
        >
          HomeGrown
        </Link>

        <nav className="flex items-center gap-1">
          <Link href="/farms">
            <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground font-normal">
              Browse Farms
            </Button>
          </Link>

          {loading ? null : user ? (
            <>
              {user.role === "Farmer" && (
                <Link href="/dashboard">
                  <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground font-normal">
                    Dashboard
                  </Button>
                </Link>
              )}
              {user.role === "Buyer" && (
                <Link href="/my-subscriptions">
                  <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground font-normal">
                    My Subscriptions
                  </Button>
                </Link>
              )}
              <span className="text-border mx-1">|</span>
              <Button
                variant="ghost"
                size="sm"
                onClick={logout}
                className="text-muted-foreground hover:text-foreground font-normal"
              >
                Sign out
              </Button>
            </>
          ) : (
            <>
              <Link href="/login">
                <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground font-normal">
                  Sign in
                </Button>
              </Link>
              <Link href="/register">
                <Button
                  size="sm"
                  className="ml-1 bg-primary text-primary-foreground hover:bg-primary/90 rounded-full px-5"
                >
                  Get started
                </Button>
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
