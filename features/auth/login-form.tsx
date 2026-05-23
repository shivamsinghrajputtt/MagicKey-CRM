"use client";

import { useState } from "react";
import { Loader2, UserPlus, LogIn } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { createClient } from "@/lib/supabase/client";

export function LoginForm() {
  const [isSignUp, setIsSignUp] = useState(false);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleAuth(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setMessage("");

    const supabase = createClient();

    if (isSignUp) {
      // Register
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName || null
          },
          emailRedirectTo: `${window.location.origin}/`
        }
      });

      if (error) {
        setMessage(error.message);
      } else if (data.session) {
        window.location.href = "/";
      } else {
        setMessage("Account created successfully! Please check your email for the confirmation link to sign in.");
      }
    } else {
      // Sign in
      const { error } = await supabase.auth.signInWithPassword({ email, password });

      if (error) {
        setMessage(error.message);
      } else {
        window.location.href = "/";
      }
    }

    setLoading(false);
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{isSignUp ? "Create broker account" : "Sign in to workspace"}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleAuth} className="space-y-4">
          {isSignUp && (
            <div className="space-y-2">
              <Label htmlFor="fullName">Full Name</Label>
              <Input
                id="fullName"
                type="text"
                autoComplete="name"
                placeholder="Riya Shah"
                value={fullName}
                onChange={(event) => setFullName(event.target.value)}
                required
              />
            </div>
          )}
          
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              autoComplete="email"
              placeholder="broker@agency.com"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              autoComplete={isSignUp ? "new-password" : "current-password"}
              placeholder="••••••••"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
            />
          </div>

          {message ? (
            <p className="rounded-md bg-muted p-3 text-sm text-muted-foreground whitespace-pre-wrap">
              {message}
            </p>
          ) : null}

          <Button className="w-full gap-1.5" type="submit" disabled={loading}>
            {loading ? (
              <Loader2 className="size-4 animate-spin" />
            ) : isSignUp ? (
              <UserPlus className="size-4" />
            ) : (
              <LogIn className="size-4" />
            )}
            {isSignUp ? "Create account" : "Sign in"}
          </Button>

          <div className="mt-4 text-center text-sm">
            {isSignUp ? (
              <p className="text-muted-foreground">
                Already have an account?{" "}
                <button
                  type="button"
                  className="font-semibold text-primary underline hover:text-primary/80"
                  onClick={() => {
                    setIsSignUp(false);
                    setMessage("");
                  }}
                >
                  Sign in here
                </button>
              </p>
            ) : (
              <p className="text-muted-foreground">
                New agent?{" "}
                <button
                  type="button"
                  className="font-semibold text-primary underline hover:text-primary/80"
                  onClick={() => {
                    setIsSignUp(true);
                    setMessage("");
                  }}
                >
                  Create an account
                </button>
              </p>
            )}
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
