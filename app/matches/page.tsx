import { AlertCircle, MessageCircle, Sparkles } from "lucide-react";

import { AppShell } from "@/components/app-shell";
import { SectionHeading } from "@/components/section-heading";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { getClients } from "@/features/clients/data";
import { getProperties } from "@/features/properties/data";
import { getTopMatches, mapClientsToRequirements } from "@/lib/matching";
import { createWhatsappUrl, formatCurrency } from "@/lib/utils";

export default async function MatchesPage() {
  const [clientsResult, propertiesResult] = await Promise.all([
    getClients({}),
    getProperties({})
  ]);

  const requirements = mapClientsToRequirements(clientsResult.clients);
  const matches = getTopMatches(requirements, propertiesResult.properties, clientsResult.clients);

  const message = clientsResult.message || propertiesResult.message;

  return (
    <AppShell>
      <SectionHeading eyebrow="Smart search" title="Requirement matches" />
      
      {message && (
        <div className="mb-4 flex gap-3 rounded-lg border bg-card p-3 text-sm text-muted-foreground">
          <AlertCircle className="mt-0.5 size-4 shrink-0 text-gold" />
          <p>{message}</p>
        </div>
      )}

      {matches.length > 0 ? (
        <div className="grid gap-3 lg:grid-cols-2">
          {matches.map((match) => (
            <Card key={`${match.requirement.id}-${match.property.id}`}>
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <span className="flex size-14 shrink-0 items-center justify-center rounded-md bg-primary text-lg font-bold text-primary-foreground">
                    {match.score}
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <h3 className="truncate font-semibold">{match.property.title}</h3>
                        <p className="truncate text-sm text-muted-foreground">
                          for {match.client?.full_name ?? "client"} · {match.requirement.location}
                        </p>
                      </div>
                      <Badge variant="gold">
                        <Sparkles className="mr-1 size-3" />
                        match
                      </Badge>
                    </div>
                    <div className="mt-3 grid grid-cols-3 gap-2 text-center text-xs">
                      <span className="rounded-md bg-muted p-2">
                        <b className="block text-sm">{match.property.intent}</b>
                        Intent
                      </span>
                      <span className="rounded-md bg-muted p-2">
                        <b className="block text-sm">{match.property.type}</b>
                        Type
                      </span>
                      <span className="rounded-md bg-muted p-2">
                        <b className="block text-sm">{formatCurrency(match.property.price)}</b>
                        Price
                      </span>
                    </div>
                    {match.client ? (
                      <Button className="mt-4 w-full" variant="success" asChild>
                        <a
                          href={createWhatsappUrl(
                            match.client.phone,
                            `Hi ${match.client.full_name}, MagicKey found a ${match.score}% match: ${match.property.title}, ${match.property.location}, ${formatCurrency(match.property.price)}.`
                          )}
                          target="_blank"
                          rel="noreferrer"
                        >
                          <MessageCircle className="size-4" />
                          Share match on WhatsApp
                        </a>
                      </Button>
                    ) : null}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="rounded-lg border bg-card p-8 text-center">
          <h3 className="font-semibold">No matches found</h3>
          <p className="mt-1 text-sm text-muted-foreground">Add more properties or update client requirements to see auto-matches here.</p>
        </div>
      )}
    </AppShell>
  );
}

