"use client";

import { Building2, CheckCircle2, Clock, Edit, Trash2, User, Circle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import type { Client, Property, Followup } from "@/lib/types";

export function FollowupCard({
  followup,
  client,
  property,
  onEdit,
  onDelete,
  onToggleStatus,
  isToggling,
  isDeleting
}: {
  followup: Followup;
  client?: Client | null;
  property?: Property | null;
  onEdit: (followup: Followup) => void;
  onDelete: (followup: Followup) => void;
  onToggleStatus: (followupId: string, currentStatus: Followup["status"]) => void;
  isToggling: boolean;
  isDeleting: boolean;
}) {
  const isOverdue = new Date(followup.due_at) < new Date() && followup.status === "pending";
  const formattedDate = new Intl.DateTimeFormat("en-IN", {
    dateStyle: "medium",
    timeStyle: "short"
  }).format(new Date(followup.due_at));

  return (
    <Card className={followup.status === "done" ? "opacity-75" : ""}>
      <CardContent className="flex items-start gap-3 p-4">
        <button
          onClick={() => onToggleStatus(followup.id, followup.status)}
          disabled={isToggling}
          className="mt-1 shrink-0 text-muted-foreground hover:text-primary transition-colors disabled:opacity-50"
          aria-label={followup.status === "done" ? "Mark as pending" : "Mark as completed"}
        >
          {followup.status === "done" ? (
            <CheckCircle2 className="size-6 text-success" />
          ) : (
            <Circle className={`size-6 ${isOverdue ? "text-destructive" : "text-gold"}`} />
          )}
        </button>

        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <h3 className={`font-semibold leading-none ${followup.status === "done" ? "line-through text-muted-foreground" : ""}`}>
              {followup.title}
            </h3>
            <Badge
              variant={
                followup.status === "done"
                  ? "success"
                  : isOverdue
                  ? "destructive"
                  : followup.status === "missed"
                  ? "destructive"
                  : "gold"
              }
              className="shrink-0"
            >
              {followup.status === "done" ? "completed" : isOverdue ? "overdue" : followup.status}
            </Badge>
          </div>

          {/* Linked Client and Property Info */}
          {(client || property) && (
            <div className="mt-2 flex flex-col gap-1.5 text-xs text-muted-foreground">
              {client && (
                <div className="flex items-center gap-1">
                  <User className="size-3.5 shrink-0" />
                  <span className="truncate font-medium text-foreground/80">{client.full_name}</span>
                  <span className="truncate font-light text-muted-foreground">({client.phone})</span>
                </div>
              )}
              {property && (
                <div className="flex items-center gap-1">
                  <Building2 className="size-3.5 shrink-0" />
                  <span className="truncate font-medium text-foreground/80">{property.title}</span>
                  <span className="truncate font-light text-muted-foreground">in {property.location}</span>
                </div>
              )}
            </div>
          )}

          {followup.notes && (
            <p className="mt-2.5 text-sm text-muted-foreground whitespace-pre-line line-clamp-3">
              {followup.notes}
            </p>
          )}

          <div className="mt-4 flex items-center justify-between gap-2 border-t pt-3">
            <span className={`flex items-center gap-1 text-xs ${isOverdue ? "text-destructive font-semibold" : "text-muted-foreground"}`}>
              <Clock className="size-3.5" />
              {formattedDate}
            </span>

            <div className="flex gap-2">
              <Button
                size="icon"
                variant="outline"
                className="size-8"
                aria-label={`Edit ${followup.title}`}
                onClick={() => onEdit(followup)}
              >
                <Edit className="size-4" />
              </Button>
              <Button
                size="icon"
                variant="outline"
                className="size-8 hover:bg-destructive/10 hover:text-destructive"
                aria-label={`Delete ${followup.title}`}
                onClick={() => onDelete(followup)}
                disabled={isDeleting}
              >
                <Trash2 className="size-4" />
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
