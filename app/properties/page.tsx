import { AppShell } from "@/components/app-shell";
import { getProperties } from "@/features/properties/data";
import { PropertyManager } from "@/features/properties/property-manager";
import { propertyFilterSchema } from "@/features/properties/schema";

type PropertiesPageProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

function firstValue(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

export default async function PropertiesPage({ searchParams }: PropertiesPageProps) {
  const params = await searchParams;
  const filters = propertyFilterSchema.parse({
    q: firstValue(params?.q),
    status: firstValue(params?.status),
    type: firstValue(params?.type),
    intent: firstValue(params?.intent),
    bhk: firstValue(params?.bhk),
    location: firstValue(params?.location),
    price_min: firstValue(params?.price_min),
    price_max: firstValue(params?.price_max)
  });
  const result = await getProperties(filters);

  return (
    <AppShell>
      <PropertyManager
        properties={result.properties}
        filters={filters}
        isDemo={result.isDemo}
        message={result.message}
      />
    </AppShell>
  );
}
