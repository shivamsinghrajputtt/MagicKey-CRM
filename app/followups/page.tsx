import { AppShell } from "@/components/app-shell";
import { FollowupManager } from "@/features/followups/followup-manager";
import { getFollowups } from "@/features/followups/data";
import { getClients } from "@/features/clients/data";
import { getProperties } from "@/features/properties/data";
import { followupFilterSchema } from "@/features/followups/schema";

type FollowupsPageProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

function firstValue(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

export default async function FollowupsPage({ searchParams }: FollowupsPageProps) {
  const params = await searchParams;
  const filters = followupFilterSchema.parse({
    q: firstValue(params?.q),
    status: firstValue(params?.status),
    client_id: firstValue(params?.client_id),
    property_id: firstValue(params?.property_id)
  });

  const [followupsResult, clientsResult, propertiesResult] = await Promise.all([
    getFollowups(filters),
    getClients({}),
    getProperties({})
  ]);

  const isDemo = followupsResult.isDemo || clientsResult.isDemo || propertiesResult.isDemo;
  const message = followupsResult.message || clientsResult.message || propertiesResult.message;

  return (
    <AppShell>
      <FollowupManager
        followups={followupsResult.followups}
        clients={clientsResult.clients}
        properties={propertiesResult.properties}
        filters={filters}
        isDemo={isDemo}
        message={message}
      />
    </AppShell>
  );
}

