import { AppShell } from "@/components/app-shell";
import { ClientManager } from "@/features/clients/client-manager";
import { getClients } from "@/features/clients/data";
import { clientFilterSchema } from "@/features/clients/schema";

type ClientsPageProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

function firstValue(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

export default async function ClientsPage({ searchParams }: ClientsPageProps) {
  const params = await searchParams;
  const filters = clientFilterSchema.parse({
    q: firstValue(params?.q),
    status: firstValue(params?.status),
    bhk: firstValue(params?.bhk),
    furnished_type: firstValue(params?.furnished_type),
    location: firstValue(params?.location),
    budget_min: firstValue(params?.budget_min),
    budget_max: firstValue(params?.budget_max)
  });
  const result = await getClients(filters);

  return (
    <AppShell>
      <ClientManager
        clients={result.clients}
        filters={filters}
        isDemo={result.isDemo}
        message={result.message}
      />
    </AppShell>
  );
}
