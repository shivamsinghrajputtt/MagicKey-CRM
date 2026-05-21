"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Bell, Home, KeyRound, Search, Users } from "lucide-react";

import { cn } from "@/lib/utils";

const items = [
  { href: "/", label: "Home", icon: Home },
  { href: "/clients", label: "Clients", icon: Users },
  { href: "/properties", label: "Stock", icon: KeyRound },
  { href: "/matches", label: "Matches", icon: Search },
  { href: "/followups", label: "Follow", icon: Bell }
] as const;

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed inset-x-0 bottom-0 z-50 border-t bg-background/96 px-2 py-2 backdrop-blur-xl safe-bottom md:hidden">
      <div className="mx-auto grid max-w-md grid-cols-5 gap-1">
        {items.map((item) => {
          const active = pathname === item.href;
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex min-h-14 flex-col items-center justify-center rounded-md px-1 text-[11px] font-medium text-muted-foreground transition-colors",
                active && "bg-primary text-primary-foreground"
              )}
            >
              <Icon className="mb-1 size-5" />
              <span className="max-w-full truncate">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
