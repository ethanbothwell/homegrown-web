"use client";

import Link from "next/link";
import { useAuth } from "@/lib/auth-context";
import { Button } from "@/components/ui/button";
import { Sprout } from "lucide-react";

export function Nav() {
  const { user, logout, loading } = useAuth();

  return (
    <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 font-semibold text-lg text-green-700">
          <Sprout className="h-5 w-5" />
          HomeGrown
        </Link>

        <nav className="flex items-center gap-2">
          <Link href="/farms">
            <Button variant="ghost" size="sm">Browse Farms</Button>
          </Link>

          {loading ? null : user ? (
            <>
              {user.role === "Farmer" && (
                <Link href="/dashboard">
                  <Button variant="ghost" size="sm">Dashboard</Button>
                </Link>
              )}
              {user.role === "Buyer" && (
                <Link href="/my-subscriptions">
                  <Button variant="ghost" size="sm">My Subscriptions</Button>
                </Link>
              )}
              <Button variant="ghost" size="sm" onClick={logout}>
                Sign out
              </Button>
            </>
          ) : (
            <>
              <Link href="/login">
                <Button variant="ghost" size="sm">Sign in</Button>
              </Link>
              <Link href="/register">
                <Button size="sm" className="bg-green-700 hover:bg-green-800 text-white">
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
