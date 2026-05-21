import Link from "next/link";
import { Building2 } from "lucide-react";

import { LoginForm } from "@/features/auth/login-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function LoginPage() {
  return (
    <main className="grid min-h-screen place-items-center bg-background px-4 py-10">
      <div className="w-full max-w-md">
        <Link href="/" className="mb-6 flex items-center justify-center gap-2">
          <span className="flex size-11 items-center justify-center rounded-md bg-primary text-primary-foreground">
            <Building2 className="size-5" />
          </span>
          <span className="text-xl font-bold">MagicKey CRM</span>
        </Link>
        <Card>
          <CardHeader>
            <CardTitle>Sign in to your broker workspace</CardTitle>
          </CardHeader>
          <CardContent>
            <LoginForm />
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
