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
import {
  propertyBhkOptions,
  propertyIntents,
  propertyStatuses,
  propertyTypes
} from "@/features/properties/constants";
import type { PropertyFilters as PropertyFiltersType } from "@/features/properties/schema";

export function PropertyFilters({ filters }: { filters: PropertyFiltersType }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [open, setOpen] = useState(
    Boolean(filters.status || filters.type || filters.intent || filters.bhk || filters.location || filters.price_min || filters.price_max)
  );
  const [values, setValues] = useState({
    q: filters.q ?? "",
    status: filters.status ?? "all",
    type: filters.type ?? "all",
    intent: filters.intent ?? "all",
    bhk: filters.bhk ?? "all",
    location: filters.location ?? "",
    price_min: filters.price_min ?? "",
    price_max: filters.price_max ?? ""
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
      router.push(`/properties${params.toString() ? `?${params.toString()}` : ""}`);
    });
  }

  function clear() {
    const empty = {
      q: "",
      status: "all",
      type: "all",
      intent: "all",
      bhk: "all",
      location: "",
      price_min: "",
      price_max: ""
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
            placeholder="Search area, owner, type"
            value={values.q}
            onChange={(event) => update("q", event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter") submit();
            }}
          />
        </div>
        <Button size="icon" variant="outline" aria-label="Filter properties" onClick={() => setOpen((current) => !current)}>
          <SlidersHorizontal className="size-4" />
        </Button>
        <Button size="icon" variant="outline" aria-label="Search properties" onClick={() => submit()} disabled={isPending}>
          {isPending ? <Loader2 className="size-4 animate-spin" /> : <Search className="size-4" />}
        </Button>
      </div>

      {open ? (
        <div className="grid gap-2 rounded-lg border bg-card p-3 sm:grid-cols-2 lg:grid-cols-4">
          <Select value={values.status} onValueChange={(value) => update("status", value)}>
            <SelectTrigger>
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All status</SelectItem>
              {propertyStatuses.map((status) => (
                <SelectItem key={status.value} value={status.value}>
                  {status.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={values.intent} onValueChange={(value) => update("intent", value)}>
            <SelectTrigger>
              <SelectValue placeholder="Rent / Buy" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Rent or buy</SelectItem>
              {propertyIntents.map((intent) => (
                <SelectItem key={intent.value} value={intent.value}>
                  {intent.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={values.type} onValueChange={(value) => update("type", value)}>
            <SelectTrigger>
              <SelectValue placeholder="Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All types</SelectItem>
              {propertyTypes.map((type) => (
                <SelectItem key={type.value} value={type.value}>
                  {type.label}
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
              {propertyBhkOptions.map((bhk) => (
                <SelectItem key={bhk} value={bhk}>
                  {bhk} BHK
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Input placeholder="Location" value={values.location} onChange={(event) => update("location", event.target.value)} />
          <Input inputMode="numeric" placeholder="Min price" value={values.price_min} onChange={(event) => update("price_min", event.target.value)} />
          <Input inputMode="numeric" placeholder="Max price" value={values.price_max} onChange={(event) => update("price_max", event.target.value)} />

          <div className="flex gap-2 sm:col-span-2 lg:col-span-4">
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
