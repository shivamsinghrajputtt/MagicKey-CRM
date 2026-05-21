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
import { ClientCard } from "@/features/clients/client-card";
import { ClientFilters } from "@/features/clients/client-filters";
import { ClientForm } from "@/features/clients/client-form";
import { deleteClientAction, saveClientAction, type ClientActionState } from "@/features/clients/actions";
import type { ClientFilters as ClientFiltersType, ClientFormValues } from "@/features/clients/schema";
import type { Client } from "@/lib/types";

export function ClientManager({
  clients,
  filters,
  isDemo,
  message
}: {
  clients: Client[];
  filters: ClientFiltersType;
  isDemo: boolean;
  message?: string;
}) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingClient, setEditingClient] = useState<Client | null>(null);
  const [deleteDialogClient, setDeleteDialogClient] = useState<Client | null>(null);
  const [actionState, setActionState] = useState<ClientActionState | null>(null);
  const [deletingClientId, setDeletingClientId] = useState<string | null>(null);
  const [isSaving, startSaving] = useTransition();
  const [isDeleting, startDeleting] = useTransition();

  function openAddDialog() {
    setEditingClient(null);
    setActionState(null);
    setDialogOpen(true);
  }

  function openEditDialog(client: Client) {
    setEditingClient(client);
    setActionState(null);
    setDialogOpen(true);
  }

  function submitClient(values: ClientFormValues) {
    startSaving(async () => {
      const result = await saveClientAction(values);
      setActionState(result);
      if (result.ok) {
        setDialogOpen(false);
      }
    });
  }

  function deleteClient(client: Client) {
    setDeletingClientId(client.id);
    startDeleting(async () => {
      const result = await deleteClientAction(client.id);
      setActionState(result);
      setDeletingClientId(null);
      if (result.ok) setDeleteDialogClient(null);
    });
  }

  return (
    <>
      <SectionHeading
        eyebrow="Pipeline"
        title="Clients"
        action={
          <Button size="sm" variant="gold" onClick={openAddDialog}>
            <Plus className="size-4" />
            New
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

      <ClientFilters filters={filters} />

      {clients.length ? (
        <div className="grid gap-3 lg:grid-cols-2">
          {clients.map((client) => (
            <ClientCard
              key={client.id}
              client={client}
              onEdit={openEditDialog}
              onDelete={setDeleteDialogClient}
              isDeleting={isDeleting && deletingClientId === client.id}
            />
          ))}
        </div>
      ) : (
        <div className="rounded-lg border bg-card p-8 text-center">
          <h3 className="font-semibold">No clients found</h3>
          <p className="mt-1 text-sm text-muted-foreground">Adjust filters or add a new client requirement.</p>
          <Button className="mt-4" variant="gold" onClick={openAddDialog}>
            <Plus className="size-4" />
            Add client
          </Button>
        </div>
      )}

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingClient ? "Edit client" : "Add client"}</DialogTitle>
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
          <ClientForm
            key={editingClient?.id ?? "new"}
            client={editingClient}
            isPending={isSaving}
            onCancel={() => setDialogOpen(false)}
            onSubmit={submitClient}
          />
        </DialogContent>
      </Dialog>

      <Dialog open={Boolean(deleteDialogClient)} onOpenChange={(open) => !open && setDeleteDialogClient(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete client</DialogTitle>
            <DialogDescription>
              {deleteDialogClient
                ? `${deleteDialogClient.full_name} will be removed from your client pipeline.`
                : "This client will be removed from your pipeline."}
            </DialogDescription>
          </DialogHeader>
          <div className="rounded-lg border bg-muted/50 p-3 text-sm text-muted-foreground">
            This also removes linked requirements through the database relationship. Follow-ups keep their history with the client link cleared.
          </div>
          <div className="mt-4 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
            <Button variant="outline" onClick={() => setDeleteDialogClient(null)} disabled={isDeleting}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => deleteDialogClient && deleteClient(deleteDialogClient)}
              disabled={isDeleting}
            >
              {isDeleting ? "Deleting..." : "Delete client"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
