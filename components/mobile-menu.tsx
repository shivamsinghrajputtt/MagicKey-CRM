"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Menu,
  Home,
  Users,
  KeyRound,
  Search,
  Bell,
  Settings,
  LogIn,
  LogOut,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { createClient } from "@/lib/supabase/client";
import type { User } from "@supabase/supabase-js";

export function MobileMenu() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  async function handleSignOut() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.refresh();
    window.location.reload();
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button className="md:hidden" size="icon" variant="ghost" aria-label="Open menu">
          <Menu className="size-5" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56 md:hidden">
        <DropdownMenuItem asChild>
          <Link href="/" className="flex items-center gap-2 cursor-pointer">
            <Home className="size-4 text-muted-foreground" />
            <span>Home</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/clients" className="flex items-center gap-2 cursor-pointer">
            <Users className="size-4 text-muted-foreground" />
            <span>Clients</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/properties" className="flex items-center gap-2 cursor-pointer">
            <KeyRound className="size-4 text-muted-foreground" />
            <span>Stock (Properties)</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/matches" className="flex items-center gap-2 cursor-pointer">
            <Search className="size-4 text-muted-foreground" />
            <span>Matches</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/followups" className="flex items-center gap-2 cursor-pointer">
            <Bell className="size-4 text-muted-foreground" />
            <span>Follow-ups</span>
          </Link>
        </DropdownMenuItem>
        
        <DropdownMenuSeparator />
        
        <DropdownMenuItem asChild>
          <Link href="/settings" className="flex items-center gap-2 cursor-pointer">
            <Settings className="size-4 text-muted-foreground" />
            <span>Settings</span>
          </Link>
        </DropdownMenuItem>
        
        <DropdownMenuSeparator />

        {user ? (
          <DropdownMenuItem 
            className="flex items-center gap-2 text-destructive focus:text-destructive focus:bg-destructive/10 cursor-pointer"
            onClick={handleSignOut}
          >
            <LogOut className="size-4" />
            <span>Sign out</span>
          </DropdownMenuItem>
        ) : (
          <DropdownMenuItem asChild>
            <Link href="/login" className="flex items-center gap-2 cursor-pointer">
              <LogIn className="size-4 text-muted-foreground" />
              <span>Sign in</span>
            </Link>
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
