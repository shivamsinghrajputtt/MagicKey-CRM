import { AppShell } from "@/components/app-shell";
import { Card, CardContent } from "@/components/ui/card";

export default function PropertiesLoading() {
  return (
    <AppShell>
      <div className="mb-4 h-8 w-40 animate-pulse rounded-md bg-muted" />
      <div className="mb-4 h-12 animate-pulse rounded-md bg-muted" />
      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: 6 }).map((_, index) => (
          <Card key={index} className="overflow-hidden">
            <div className="aspect-[4/3] animate-pulse bg-muted" />
            <CardContent className="space-y-3 p-4">
              <div className="h-4 w-2/3 animate-pulse rounded bg-muted" />
              <div className="h-3 w-1/2 animate-pulse rounded bg-muted" />
              <div className="h-8 w-full animate-pulse rounded bg-muted" />
            </CardContent>
          </Card>
        ))}
      </div>
    </AppShell>
  );
}
