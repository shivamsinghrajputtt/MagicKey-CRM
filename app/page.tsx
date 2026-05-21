import Link from "next/link";
import { AlertCircle, Bell, Building2, CalendarClock, IndianRupee, Search, Users } from "lucide-react";

import { AppShell } from "@/components/app-shell";
import { SectionHeading } from "@/components/section-heading";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatCard } from "@/features/dashboard/stat-card";
import { getClients } from "@/features/clients/data";
import { getProperties } from "@/features/properties/data";
import { getFollowups } from "@/features/followups/data";
import { getTopMatches, mapClientsToRequirements } from "@/lib/matching";
import { createWhatsappUrl, formatCurrency, getInitials } from "@/lib/utils";

export default async function DashboardPage() {
  const [clientsResult, propertiesResult, followupsResult] = await Promise.all([
    getClients({}),
    getProperties({}),
    getFollowups({})
  ]);

  const clients = clientsResult.clients;
  const properties = propertiesResult.properties;
  const followups = followupsResult.followups;

  const hotClients = clients.filter((client) => client.status === "hot").length;
  const availableProperties = properties.filter((property) => property.status === "available").length;
  const totalInventoryValue = properties.reduce((sum, property) => sum + property.price, 0);

  const requirements = mapClientsToRequirements(clients);
  const matches = getTopMatches(requirements, properties, clients);

  const pendingFollowups = followups.filter((f) => f.status === "pending");

  const message = clientsResult.message || propertiesResult.message || followupsResult.message;

  return (
    <AppShell>
      {message && (
        <div className="mb-4 flex gap-3 rounded-lg border bg-card p-3 text-sm text-muted-foreground">
          <AlertCircle className="mt-0.5 size-4 shrink-0 text-gold" />
          <p>
            {message}
            {message.toLowerCase().includes("sign in") && (
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
      )}

      <section className="grid gap-4 md:grid-cols-[1.2fr_0.8fr]">
        <div className="rounded-lg border bg-primary p-5 text-primary-foreground shadow-soft">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-sm text-primary-foreground/70">Today</p>
              <h1 className="mt-1 text-2xl font-bold tracking-normal md:text-4xl">
                Close the best property match faster.
              </h1>
            </div>
            <Badge variant="gold" className="shrink-0">
              Live CRM
            </Badge>
          </div>
          <div className="mt-5 grid grid-cols-2 gap-2 sm:grid-cols-4">
            <Button variant="secondary" asChild>
              <Link href="/clients">
                <Users className="size-4" />
                Clients
              </Link>
            </Button>
            <Button variant="secondary" asChild>
              <Link href="/properties">
                <Building2 className="size-4" />
                Stock
              </Link>
            </Button>
            <Button variant="secondary" asChild>
              <Link href="/matches">
                <Search className="size-4" />
                Match
              </Link>
            </Button>
            <Button variant="gold" asChild>
              <Link href="/followups">
                <Bell className="size-4" />
                Follow
              </Link>
            </Button>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Next follow-up</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {pendingFollowups.length > 0 ? (
              pendingFollowups.slice(0, 2).map((followup) => (
                <div key={followup.id} className="flex gap-3 rounded-md bg-muted/60 p-3">
                  <span className="flex size-10 shrink-0 items-center justify-center rounded-md bg-background">
                    <CalendarClock className="size-5 text-gold" />
                  </span>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold">{followup.title}</p>
                    <p className="text-xs text-muted-foreground">
                      {new Intl.DateTimeFormat("en-IN", {
                        dateStyle: "medium",
                        timeStyle: "short"
                      }).format(new Date(followup.due_at))}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-xs text-muted-foreground">No pending follow-ups</p>
            )}
          </CardContent>
        </Card>
      </section>

      <section className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Total clients" value={String(clients.length)} helper={`${hotClients} hot leads`} icon={Users} />
        <StatCard label="Inventory" value={String(properties.length)} helper={`${availableProperties} available`} icon={Building2} tone="gold" />
        <StatCard label="Requirements" value={String(requirements.length)} helper="Ready for matching" icon={Search} />
        <StatCard label="Inventory value" value={formatCurrency(totalInventoryValue)} helper="Across listed stock" icon={IndianRupee} tone="success" />
      </section>

      <section className="mt-6 grid gap-6 lg:grid-cols-[1fr_0.9fr]">
        <div>
          <SectionHeading
            eyebrow="Priority"
            title="Best matches"
            action={
              <Button size="sm" variant="outline" asChild>
                <Link href="/matches">View all</Link>
              </Button>
            }
          />
          <div className="space-y-3">
            {matches.length > 0 ? (
              matches.slice(0, 3).map((match) => (
                <Card key={`${match.requirement.id}-${match.property.id}`}>
                  <CardContent className="flex items-center gap-3 p-4">
                    <span className="flex size-12 shrink-0 items-center justify-center rounded-md bg-gold/20 text-sm font-bold text-gold-foreground dark:text-gold">
                      {match.score}%
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-semibold">{match.property.title}</p>
                      <p className="truncate text-sm text-muted-foreground">
                        {match.client?.full_name} · {match.property.location} · {formatCurrency(match.property.price)}
                      </p>
                    </div>
                    {match.client ? (
                      <Button size="sm" variant="success" asChild>
                        <a
                          href={createWhatsappUrl(
                            match.client.phone,
                            `Hi ${match.client.full_name}, I found a ${match.property.title} in ${match.property.location} that matches your requirement.`
                          )}
                          target="_blank"
                          rel="noreferrer"
                        >
                          Share
                        </a>
                      </Button>
                    ) : null}
                  </CardContent>
                </Card>
              ))
            ) : (
              <p className="text-sm text-muted-foreground">No matches found</p>
            )}
          </div>
        </div>

        <div>
          <SectionHeading eyebrow="Clients" title="Recent conversations" />
          <Card>
            <CardContent className="divide-y p-0">
              {clients.length > 0 ? (
                clients.slice(0, 5).map((client) => (
                  <Link key={client.id} href="/clients" className="flex items-center gap-3 p-4 hover:bg-muted/50">
                    <Avatar>
                      <AvatarFallback>{getInitials(client.full_name)}</AvatarFallback>
                    </Avatar>
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-semibold">{client.full_name}</p>
                      <p className="truncate text-sm text-muted-foreground">{client.notes || "No notes"}</p>
                    </div>
                    <Badge variant={client.status === "hot" ? "destructive" : "secondary"}>{client.status}</Badge>
                  </Link>
                ))
              ) : (
                <p className="p-4 text-sm text-muted-foreground">No clients found</p>
              )}
            </CardContent>
          </Card>
        </div>
      </section>
    </AppShell>
  );
}

