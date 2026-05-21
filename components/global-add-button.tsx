"use client";

import { useState, useTransition } from "react";
import { Plus, UserPlus, Building, AlertCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { ClientForm } from "@/features/clients/client-form";
import { saveClientAction } from "@/features/clients/actions";
import type { ClientFormValues } from "@/features/clients/schema";

import { PropertyForm } from "@/features/properties/property-form";
import { savePropertyAction } from "@/features/properties/actions";
import type { PropertyFormValues } from "@/features/properties/schema";

import { hasSupabaseEnv } from "@/lib/env";

export function GlobalAddButton() {
  const router = useRouter();
  const [clientDialogOpen, setClientDialogOpen] = useState(false);
  const [propertyDialogOpen, setPropertyDialogOpen] = useState(false);

  const [clientError, setClientError] = useState<string | null>(null);
  const [propertyError, setPropertyError] = useState<string | null>(null);

  const [isClientSaving, startClientSaving] = useTransition();
  const [isPropertySaving, startPropertySaving] = useTransition();

  const isDemo = !hasSupabaseEnv();

  function handleClientSubmit(values: ClientFormValues) {
    setClientError(null);
    startClientSaving(async () => {
      try {
        const result = await saveClientAction(values);
        if (result.ok) {
          setClientDialogOpen(false);
          router.push("/clients");
          router.refresh();
        } else {
          setClientError(result.message);
        }
      } catch (err) {
        setClientError(err instanceof Error ? err.message : "An unexpected error occurred.");
      }
    });
  }

  function handlePropertySubmit(values: PropertyFormValues) {
    setPropertyError(null);
    startPropertySaving(async () => {
      try {
        const result = await savePropertyAction(values);
        if (result.ok) {
          setPropertyDialogOpen(false);
          router.push("/properties");
          router.refresh();
        } else {
          setPropertyError(result.message);
        }
      } catch (err) {
        setPropertyError(err instanceof Error ? err.message : "An unexpected error occurred.");
      }
    });
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button className="ml-auto md:ml-0 gap-1.5" size="sm" variant="gold">
            <Plus className="size-4" />
            Add
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          <DropdownMenuItem
            className="cursor-pointer gap-2"
            onSelect={(e) => {
              e.preventDefault();
              setClientError(null);
              setClientDialogOpen(true);
            }}
          >
            <UserPlus className="size-4" />
            Add Client / Tenant
          </DropdownMenuItem>
          <DropdownMenuItem
            className="cursor-pointer gap-2"
            onSelect={(e) => {
              e.preventDefault();
              setPropertyError(null);
              setPropertyDialogOpen(true);
            }}
          >
            <Building className="size-4" />
            Add Property
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Client Dialog */}
      <Dialog open={clientDialogOpen} onOpenChange={setClientDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Add client</DialogTitle>
            <DialogDescription>
              {isDemo ? (
                <span>
                  Supabase must be configured and signed in before changes are saved.{" "}
                  <Link href="/login" className="font-semibold text-primary underline hover:text-primary/80">
                    Sign in here
                  </Link>
                  .
                </span>
              ) : (
                "Keep the requirement simple so matching stays fast."
              )}
            </DialogDescription>
          </DialogHeader>

          {clientError && (
            <div className="mb-4 flex gap-3 rounded-lg border border-destructive/20 bg-destructive/10 p-3 text-sm text-destructive">
              <AlertCircle className="mt-0.5 size-4 shrink-0 text-destructive" />
              <p>{clientError}</p>
            </div>
          )}

          <ClientForm
            isPending={isClientSaving}
            onCancel={() => setClientDialogOpen(false)}
            onSubmit={handleClientSubmit}
          />
        </DialogContent>
      </Dialog>

      {/* Property Dialog */}
      <Dialog open={propertyDialogOpen} onOpenChange={setPropertyDialogOpen}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>Add property</DialogTitle>
            <DialogDescription>
              {isDemo ? (
                <span>
                  Supabase must be configured and signed in before changes are saved.{" "}
                  <Link href="/login" className="font-semibold text-primary underline hover:text-primary/80">
                    Sign in here
                  </Link>
                  .
                </span>
              ) : (
                "Keep the listing clear so brokers can match and share it fast."
              )}
            </DialogDescription>
          </DialogHeader>

          {propertyError && (
            <div className="mb-4 flex gap-3 rounded-lg border border-destructive/20 bg-destructive/10 p-3 text-sm text-destructive">
              <AlertCircle className="mt-0.5 size-4 shrink-0 text-destructive" />
              <p>{propertyError}</p>
            </div>
          )}

          <PropertyForm
            isPending={isPropertySaving}
            onCancel={() => setPropertyDialogOpen(false)}
            onSubmit={handlePropertySubmit}
          />
        </DialogContent>
      </Dialog>
    </>
  );
}
