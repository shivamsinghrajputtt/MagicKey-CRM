import { AppShell } from "@/components/app-shell";
import { Card, CardContent } from "@/components/ui/card";

export default function ClientsLoading() {
  return (
    <AppShell>
      <div className="mb-4 h-8 w-36 animate-pulse rounded-md bg-muted" />
      <div className="mb-4 h-12 animate-pulse rounded-md bg-muted" />
      <div className="grid gap-3 lg:grid-cols-2">
        {Array.from({ length: 4 }).map((_, index) => (
          <Card key={index}>
            <CardContent className="flex gap-3 p-4">
              <div className="size-12 animate-pulse rounded-full bg-muted" />
              <div className="flex-1 space-y-3">
                <div className="h-4 w-1/2 animate-pulse rounded bg-muted" />
                <div className="h-3 w-2/3 animate-pulse rounded bg-muted" />
                <div className="h-8 w-full animate-pulse rounded bg-muted" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </AppShell>
  );
}
