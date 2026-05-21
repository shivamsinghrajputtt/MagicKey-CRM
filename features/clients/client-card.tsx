"use client";

import { Edit, MessageCircle, Trash2 } from "lucide-react";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { furnishedTypes, getOptionLabel, requirementTypes } from "@/features/clients/constants";
import type { Client } from "@/lib/types";
import { createWhatsappUrl, formatCurrency, getInitials } from "@/lib/utils";

export function ClientCard({
  client,
  onEdit,
  onDelete,
  isDeleting
}: {
  client: Client;
  onEdit: (client: Client) => void;
  onDelete: (client: Client) => void;
  isDeleting: boolean;
}) {
  const budget = client.budget ?? client.budget_max ?? client.budget_min;
  const location = client.preferred_location ?? client.preferred_locations?.[0] ?? "Location pending";

  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <Avatar className="size-12">
            <AvatarFallback>{getInitials(client.full_name)}</AvatarFallback>
          </Avatar>
          <div className="min-w-0 flex-1">
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <h3 className="truncate font-semibold">{client.full_name}</h3>
                <p className="truncate text-sm text-muted-foreground">{client.phone}</p>
              </div>
              <Badge variant={client.status === "hot" ? "destructive" : client.status === "closed" ? "success" : "secondary"}>
                {client.status}
              </Badge>
            </div>

            <div className="mt-3 flex flex-wrap gap-2">
              <Badge variant="outline">{getOptionLabel(requirementTypes, client.requirement_type)}</Badge>
              <Badge variant="gold">{client.bhk ? `${client.bhk} BHK` : "Any BHK"}</Badge>
              <Badge variant="outline">{getOptionLabel(furnishedTypes, client.furnished_type)}</Badge>
              <Badge variant="outline">{location}</Badge>
            </div>

            <p className="mt-3 line-clamp-2 text-sm text-muted-foreground">{client.notes || "No notes added."}</p>

            <div className="mt-4 flex flex-wrap items-center justify-between gap-2">
              <p className="text-sm font-semibold">{budget ? formatCurrency(budget) : "Budget pending"}</p>
              <div className="flex gap-2">
                <Button size="icon" variant="outline" aria-label={`Edit ${client.full_name}`} onClick={() => onEdit(client)}>
                  <Edit className="size-4" />
                </Button>
                <Button
                  size="icon"
                  variant="outline"
                  aria-label={`Delete ${client.full_name}`}
                  onClick={() => onDelete(client)}
                  disabled={isDeleting}
                >
                  <Trash2 className="size-4" />
                </Button>
                <Button size="sm" variant="success" asChild>
                  <a
                    href={createWhatsappUrl(client.phone, `Hi ${client.full_name}, following up from MagicKey.`)}
                    target="_blank"
                    rel="noreferrer"
                  >
                    <MessageCircle className="size-4" />
                    WhatsApp
                  </a>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
