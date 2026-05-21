import type { Client, Property, Requirement } from "@/lib/types";

export function scoreRequirementMatch(requirement: Requirement, property: Property) {
  let score = 0;

  if (requirement.intent === property.intent) score += 25;
  if (!requirement.property_type || requirement.property_type === property.type) score += 20;
  if (property.location.toLowerCase().includes(requirement.location.toLowerCase())) score += 20;
  if (property.price >= requirement.budget_min && property.price <= requirement.budget_max) score += 25;
  if (!requirement.bedrooms || property.bedrooms === requirement.bedrooms) score += 10;

  return score;
}

export function mapClientsToRequirements(clients: Client[]): Requirement[] {
  return clients
    .filter((client) => client.requirement_type && client.preferred_location)
    .map((client) => ({
      id: `req-${client.id}`,
      client_id: client.id,
      intent: client.requirement_type!,
      location: client.preferred_location!,
      budget_min: client.budget_min ?? 0,
      budget_max: client.budget_max ?? Number.MAX_SAFE_INTEGER,
      bedrooms: client.bhk,
      notes: client.notes,
      created_at: client.created_at
    }));
}

export function getTopMatches(requirements: Requirement[], properties: Property[], clients: Client[]) {
  return requirements
    .flatMap((requirement) =>
      properties.map((property) => ({
        requirement,
        property,
        client: clients.find((client) => client.id === requirement.client_id),
        score: scoreRequirementMatch(requirement, property)
      }))
    )
    .filter((match) => match.score >= 60)
    .sort((a, b) => b.score - a.score)
    .slice(0, 6);
}
