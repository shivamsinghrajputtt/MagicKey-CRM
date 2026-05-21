"use client";

import { useState, useTransition } from "react";
import { AlertCircle, Plus, Search, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";

import { SectionHeading } from "@/components/section-heading";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog";
import { FollowupCard } from "@/features/followups/followup-card";
import { FollowupForm } from "@/features/followups/followup-form";
import {
  saveFollowupAction,
  deleteFollowupAction,
  toggleFollowupStatusAction,
  type FollowupActionState
} from "@/features/followups/actions";
import type { FollowupFilters, FollowupFormValues } from "@/features/followups/schema";
import type { Client, Property, Followup } from "@/lib/types";

export function FollowupManager({
  followups,
  clients,
  properties,
  filters,
  isDemo,
  message
}: {
  followups: Followup[];
  clients: Client[];
  properties: Property[];
  filters: FollowupFilters;
  isDemo: boolean;
  message?: string;
}) {
  const router = useRouter();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingFollowup, setEditingFollowup] = useState<Followup | null>(null);
  const [deleteDialogFollowup, setDeleteDialogFollowup] = useState<Followup | null>(null);
  const [actionState, setActionState] = useState<FollowupActionState | null>(null);
  const [deletingFollowupId, setDeletingFollowupId] = useState<string | null>(null);
  const [togglingFollowupId, setTogglingFollowupId] = useState<string | null>(null);
  const [searchVal, setSearchVal] = useState(filters.q ?? "");

  const [isSaving, startSaving] = useTransition();
  const [isDeleting, startDeleting] = useTransition();
  const [isToggling, startToggling] = useTransition();
  const [isFiltering, startFiltering] = useTransition();

  function openAddDialog() {
    setEditingFollowup(null);
    setActionState(null);
    setDialogOpen(true);
  }

  function openEditDialog(followup: Followup) {
    setEditingFollowup(followup);
    setActionState(null);
    setDialogOpen(true);
  }

  function submitFollowup(values: FollowupFormValues) {
    startSaving(async () => {
      const result = await saveFollowupAction(values);
      setActionState(result);
      if (result.ok) {
        setDialogOpen(false);
      }
    });
  }

  function deleteFollowup(followup: Followup) {
    setDeletingFollowupId(followup.id);
    startDeleting(async () => {
      const result = await deleteFollowupAction(followup.id);
      setActionState(result);
      setDeletingFollowupId(null);
      if (result.ok) setDeleteDialogFollowup(null);
    });
  }

  function handleToggleStatus(followupId: string, currentStatus: Followup["status"]) {
    setTogglingFollowupId(followupId);
    const nextStatus = currentStatus === "done" ? "pending" : "done";
    startToggling(async () => {
      const result = await toggleFollowupStatusAction(followupId, nextStatus);
      setActionState(result);
      setTogglingFollowupId(null);
    });
  }

  function handleSearchSubmit(val = searchVal) {
    const params = new URLSearchParams();
    if (val) params.set("q", val);
    if (filters.status && filters.status !== "all") params.set("status", filters.status);
    if (filters.client_id) params.set("client_id", filters.client_id);
    if (filters.property_id) params.set("property_id", filters.property_id);

    startFiltering(() => {
      router.push(`/followups${params.toString() ? `?${params.toString()}` : ""}`);
    });
  }

  function handleStatusTabChange(status: string) {
    const params = new URLSearchParams();
    if (searchVal) params.set("q", searchVal);
    if (status && status !== "all") params.set("status", status);
    if (filters.client_id) params.set("client_id", filters.client_id);
    if (filters.property_id) params.set("property_id", filters.property_id);

    startFiltering(() => {
      router.push(`/followups${params.toString() ? `?${params.toString()}` : ""}`);
    });
  }

  const activeStatusTab = filters.status ?? "all";

  return (
    <>
      <SectionHeading
        eyebrow="Reminders"
        title="Follow-ups"
        action={
          <Button size="sm" variant="gold" onClick={openAddDialog}>
            <Plus className="size-4" />
            New Follow-up
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

      {/* Filters & Tabs */}
      <div className="mb-4 space-y-3">
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              className="pl-9"
              placeholder="Search by title, client, or notes..."
              value={searchVal}
              onChange={(e) => setSearchVal(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleSearchSubmit();
              }}
            />
          </div>
          <Button
            size="icon"
            variant="outline"
            aria-label="Search follow-ups"
            onClick={() => handleSearchSubmit()}
            disabled={isFiltering}
          >
            {isFiltering ? <Loader2 className="size-4 animate-spin" /> : <Search className="size-4" />}
          </Button>
        </div>

        {/* Tab filters */}
        <div className="flex border-b text-sm font-medium">
          {[
            { value: "all", label: "All" },
            { value: "pending", label: "Pending" },
            { value: "done", label: "Completed" },
            { value: "missed", label: "Missed" }
          ].map((tab) => {
            const active = activeStatusTab === tab.value;
            return (
              <button
                key={tab.value}
                onClick={() => handleStatusTabChange(tab.value)}
                disabled={isFiltering}
                className={`px-4 py-2 border-b-2 transition-colors ${
                  active
                    ? "border-gold text-foreground font-semibold"
                    : "border-transparent text-muted-foreground hover:text-foreground"
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Grid of Cards */}
      {followups.length ? (
        <div className="grid gap-3 md:grid-cols-2">
          {followups.map((followup) => {
            const client = clients.find((c) => c.id === followup.client_id);
            const property = properties.find((p) => p.id === followup.property_id);
            return (
              <FollowupCard
                key={followup.id}
                followup={followup}
                client={client}
                property={property}
                onEdit={openEditDialog}
                onDelete={setDeleteDialogFollowup}
                onToggleStatus={handleToggleStatus}
                isToggling={isToggling && togglingFollowupId === followup.id}
                isDeleting={isDeleting && deletingFollowupId === followup.id}
              />
            );
          })}
        </div>
      ) : (
        <div className="rounded-lg border bg-card p-8 text-center">
          <h3 className="font-semibold">No follow-ups found</h3>
          <p className="mt-1 text-sm text-muted-foreground">Adjust filters or create a new reminder task.</p>
          <Button className="mt-4" variant="gold" onClick={openAddDialog}>
            <Plus className="size-4" />
            Add follow-up
          </Button>
        </div>
      )}

      {/* Add / Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>{editingFollowup ? "Edit Follow-up" : "Add Follow-up"}</DialogTitle>
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
                "Assign tasks, site visits, or client follow-ups to keep deals moving."
              )}
            </DialogDescription>
          </DialogHeader>
          <FollowupForm
            key={editingFollowup?.id ?? "new"}
            followup={editingFollowup}
            clients={clients}
            properties={properties}
            isPending={isSaving}
            onCancel={() => setDialogOpen(false)}
            onSubmit={submitFollowup}
          />
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <Dialog
        open={Boolean(deleteDialogFollowup)}
        onOpenChange={(open) => !open && setDeleteDialogFollowup(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete follow-up</DialogTitle>
            <DialogDescription>
              {deleteDialogFollowup
                ? `"${deleteDialogFollowup.title}" will be permanently removed.`
                : "This follow-up will be permanently removed."}
            </DialogDescription>
          </DialogHeader>
          <div className="rounded-lg border bg-muted/50 p-3 text-sm text-muted-foreground">
            This action cannot be undone.
          </div>
          <div className="mt-4 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
            <Button variant="outline" onClick={() => setDeleteDialogFollowup(null)} disabled={isDeleting}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => deleteDialogFollowup && deleteFollowup(deleteDialogFollowup)}
              disabled={isDeleting}
            >
              {isDeleting ? "Deleting..." : "Delete follow-up"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
