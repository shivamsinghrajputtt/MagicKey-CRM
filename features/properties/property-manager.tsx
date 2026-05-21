"use client";

import { useState, useTransition } from "react";
import { AlertCircle, Plus } from "lucide-react";

import Link from "next/link";

import { SectionHeading } from "@/components/section-heading";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog";
import { deletePropertyAction, savePropertyAction, type PropertyActionState } from "@/features/properties/actions";
import { PropertyCard } from "@/features/properties/property-card";
import { PropertyFilters } from "@/features/properties/property-filters";
import { PropertyForm } from "@/features/properties/property-form";
import type { PropertyFilters as PropertyFiltersType, PropertyFormValues } from "@/features/properties/schema";
import type { Property } from "@/lib/types";

export function PropertyManager({
  properties,
  filters,
  isDemo,
  message
}: {
  properties: Property[];
  filters: PropertyFiltersType;
  isDemo: boolean;
  message?: string;
}) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingProperty, setEditingProperty] = useState<Property | null>(null);
  const [deleteDialogProperty, setDeleteDialogProperty] = useState<Property | null>(null);
  const [actionState, setActionState] = useState<PropertyActionState | null>(null);
  const [deletingPropertyId, setDeletingPropertyId] = useState<string | null>(null);
  const [isSaving, startSaving] = useTransition();
  const [isDeleting, startDeleting] = useTransition();

  function openAddDialog() {
    setEditingProperty(null);
    setActionState(null);
    setDialogOpen(true);
  }

  function openEditDialog(property: Property) {
    setEditingProperty(property);
    setActionState(null);
    setDialogOpen(true);
  }

  function submitProperty(values: PropertyFormValues) {
    startSaving(async () => {
      const result = await savePropertyAction(values);
      setActionState(result);
      if (result.ok) {
        setDialogOpen(false);
      }
    });
  }

  function deleteProperty(property: Property) {
    setDeletingPropertyId(property.id);
    startDeleting(async () => {
      const result = await deletePropertyAction(property.id);
      setActionState(result);
      setDeletingPropertyId(null);
      if (result.ok) setDeleteDialogProperty(null);
    });
  }

  return (
    <>
      <SectionHeading
        eyebrow="Inventory"
        title="Properties"
        action={
          <Button size="sm" variant="gold" onClick={openAddDialog}>
            <Plus className="size-4" />
            Add
          </Button>
        }
      />

      {message || actionState?.message ? (
        <div className="mb-4 flex gap-3 rounded-lg border bg-card p-3 text-sm text-muted-foreground">
          <AlertCircle className="mt-0.5 size-4 shrink-0 text-gold" />
          <p>
            {actionState?.message ?? message}
            {isDemo && (
              <>
                {" "}
                <Link href="/login" className="font-semibold text-primary underline hover:text-primary/80">
                  Sign in here
                </Link>
                .
              </>
            )}
          </p>
        </div>
      ) : null}

      <PropertyFilters filters={filters} />

      {properties.length ? (
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {properties.map((property) => (
            <PropertyCard
              key={property.id}
              property={property}
              onEdit={openEditDialog}
              onDelete={setDeleteDialogProperty}
              isDeleting={isDeleting && deletingPropertyId === property.id}
            />
          ))}
        </div>
      ) : (
        <div className="rounded-lg border bg-card p-8 text-center">
          <h3 className="font-semibold">No properties found</h3>
          <p className="mt-1 text-sm text-muted-foreground">Adjust filters or add a fresh property listing.</p>
          <Button className="mt-4" variant="gold" onClick={openAddDialog}>
            <Plus className="size-4" />
            Add property
          </Button>
        </div>
      )}

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>{editingProperty ? "Edit property" : "Add property"}</DialogTitle>
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
          <PropertyForm
            key={editingProperty?.id ?? "new"}
            property={editingProperty}
            isPending={isSaving}
            onCancel={() => setDialogOpen(false)}
            onSubmit={submitProperty}
          />
        </DialogContent>
      </Dialog>

      <Dialog open={Boolean(deleteDialogProperty)} onOpenChange={(open) => !open && setDeleteDialogProperty(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete property</DialogTitle>
            <DialogDescription>
              {deleteDialogProperty
                ? `${deleteDialogProperty.title} will be removed from your inventory.`
                : "This property will be removed from your inventory."}
            </DialogDescription>
          </DialogHeader>
          <div className="rounded-lg border bg-muted/50 p-3 text-sm text-muted-foreground">
            Existing matches for this property will be removed through the database relationship.
          </div>
          <div className="mt-4 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
            <Button variant="outline" onClick={() => setDeleteDialogProperty(null)} disabled={isDeleting}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => deleteDialogProperty && deleteProperty(deleteDialogProperty)}
              disabled={isDeleting}
            >
              {isDeleting ? "Deleting..." : "Delete property"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
