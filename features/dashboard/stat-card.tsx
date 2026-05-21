import type { LucideIcon } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export function StatCard({
  label,
  value,
  helper,
  icon: Icon,
  tone = "default"
}: {
  label: string;
  value: string;
  helper: string;
  icon: LucideIcon;
  tone?: "default" | "gold" | "success";
}) {
  return (
    <Card className="overflow-hidden">
      <CardContent className="flex items-center gap-3 p-4">
        <span
          className={cn(
            "flex size-11 shrink-0 items-center justify-center rounded-md bg-muted",
            tone === "gold" && "bg-gold/20 text-gold-foreground dark:text-gold",
            tone === "success" && "bg-success/15 text-success dark:text-emerald-300"
          )}
        >
          <Icon className="size-5" />
        </span>
        <span className="min-w-0">
          <span className="block text-2xl font-bold leading-tight">{value}</span>
          <span className="block truncate text-xs font-medium text-muted-foreground">{label}</span>
          <span className="block truncate text-xs text-muted-foreground">{helper}</span>
        </span>
      </CardContent>
    </Card>
  );
}
