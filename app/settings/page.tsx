import Link from "next/link";
import { Database, ExternalLink, ShieldCheck } from "lucide-react";

import { AppShell } from "@/components/app-shell";
import { SectionHeading } from "@/components/section-heading";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function SettingsPage() {
  return (
    <AppShell>
      <SectionHeading eyebrow="Workspace" title="Settings" />
      <div className="grid gap-3 md:grid-cols-2">
        <Card>
          <CardContent className="flex gap-3 p-4">
            <Database className="mt-1 size-5 text-gold" />
            <div>
              <h3 className="font-semibold">Supabase setup</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                Run the schema in supabase/schema.sql and add the environment variables in Vercel.
              </p>
              <Button className="mt-4" variant="outline" asChild>
                <Link href="/login">
                  <ExternalLink className="size-4" />
                  Test auth
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex gap-3 p-4">
            <ShieldCheck className="mt-1 size-5 text-success" />
            <div>
              <h3 className="font-semibold">Row-level security</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                Every CRM table is protected by user_id policies so each broker sees only their own data.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </AppShell>
  );
}
