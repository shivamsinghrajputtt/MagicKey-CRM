"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Search, SlidersHorizontal, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { bhkOptions, clientStatuses, furnishedTypes } from "@/features/clients/constants";
import type { ClientFilters } from "@/features/clients/schema";

export function ClientFilters({ filters }: { filters: ClientFilters }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [open, setOpen] = useState(
    Boolean(filters.status || filters.bhk || filters.furnished_type || filters.location || filters.budget_min || filters.budget_max)
  );
  const [values, setValues] = useState({
    q: filters.q ?? "",
    status: filters.status ?? "all",
    bhk: filters.bhk ?? "all",
    furnished_type: filters.furnished_type ?? "all",
    location: filters.location ?? "",
    budget_min: filters.budget_min ?? "",
    budget_max: filters.budget_max ?? ""
  });

  function update(key: keyof typeof values, value: string) {
    setValues((current) => ({ ...current, [key]: value }));
  }

  function submit(nextValues = values) {
    const params = new URLSearchParams();
    Object.entries(nextValues).forEach(([key, value]) => {
      if (value && value !== "all") params.set(key, value);
    });

    startTransition(() => {
      router.push(`/clients${params.toString() ? `?${params.toString()}` : ""}`);
    });
  }

  function clear() {
    const empty = {
      q: "",
      status: "all",
      bhk: "all",
      furnished_type: "all",
      location: "",
      budget_min: "",
      budget_max: ""
    };
    setValues(empty);
    submit(empty);
  }

  return (
    <div className="mb-4 space-y-3">
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            className="pl-9"
            placeholder="Search client, phone, location"
            value={values.q}
            onChange={(event) => update("q", event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter") submit();
            }}
          />
        </div>
        <Button size="icon" variant="outline" aria-label="Filter clients" onClick={() => setOpen((current) => !current)}>
          <SlidersHorizontal className="size-4" />
        </Button>
        <Button size="icon" variant="outline" aria-label="Search clients" onClick={() => submit()} disabled={isPending}>
          {isPending ? <Loader2 className="size-4 animate-spin" /> : <Search className="size-4" />}
        </Button>
      </div>

      {open ? (
        <div className="grid gap-2 rounded-lg border bg-card p-3 sm:grid-cols-2 lg:grid-cols-6">
          <Select value={values.status} onValueChange={(value) => update("status", value)}>
            <SelectTrigger>
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All status</SelectItem>
              {clientStatuses.map((status) => (
                <SelectItem key={status.value} value={status.value}>
                  {status.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={values.bhk} onValueChange={(value) => update("bhk", value)}>
            <SelectTrigger>
              <SelectValue placeholder="BHK" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Any BHK</SelectItem>
              {bhkOptions.map((bhk) => (
                <SelectItem key={bhk} value={bhk}>
                  {bhk} BHK
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={values.furnished_type} onValueChange={(value) => update("furnished_type", value)}>
            <SelectTrigger>
              <SelectValue placeholder="Furnished" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Any furnished</SelectItem>
              {furnishedTypes.map((type) => (
                <SelectItem key={type.value} value={type.value}>
                  {type.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Input placeholder="Location" value={values.location} onChange={(event) => update("location", event.target.value)} />
          <Input inputMode="numeric" placeholder="Min budget" value={values.budget_min} onChange={(event) => update("budget_min", event.target.value)} />
          <Input inputMode="numeric" placeholder="Max budget" value={values.budget_max} onChange={(event) => update("budget_max", event.target.value)} />

          <div className="flex gap-2 sm:col-span-2 lg:col-span-6">
            <Button className="flex-1" onClick={() => submit()} disabled={isPending}>
              {isPending ? <Loader2 className="size-4 animate-spin" /> : null}
              Apply filters
            </Button>
            <Button type="button" variant="outline" onClick={clear}>
              <X className="size-4" />
              Clear
            </Button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
