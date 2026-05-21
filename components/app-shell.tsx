import Link from "next/link";
import type { ReactNode } from "react";
import { Building2, Menu, Search } from "lucide-react";

import { BottomNav } from "@/components/bottom-nav";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import { GlobalAddButton } from "@/components/global-add-button";

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-40 border-b bg-background/92 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-7xl items-center gap-3 px-4">
          <Link href="/" className="flex min-w-0 items-center gap-2" aria-label="MagicKey CRM home">
            <span className="flex size-10 items-center justify-center rounded-md bg-primary text-primary-foreground">
              <Building2 className="size-5" />
            </span>
            <span className="min-w-0">
              <span className="block truncate text-sm font-bold">MagicKey CRM</span>
              <span className="block truncate text-xs text-muted-foreground">Broker workspace</span>
            </span>
          </Link>

          <div className="ml-auto hidden max-w-sm flex-1 items-center rounded-md border bg-card px-3 py-2 text-sm text-muted-foreground md:flex">
            <Search className="mr-2 size-4" />
            Search clients, areas, inventory
          </div>

          <GlobalAddButton />
          <ThemeToggle />
          <Button className="md:hidden" size="icon" variant="ghost" aria-label="Open menu">
            <Menu className="size-5" />
          </Button>
        </div>
      </header>
      <main className="mx-auto max-w-7xl px-4 pb-28 pt-4 md:pb-10 md:pt-6">{children}</main>
      <BottomNav />
    </div>
  );
}
