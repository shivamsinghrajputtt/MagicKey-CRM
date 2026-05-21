"use client";

import Image from "next/image";
import { BedDouble, Edit, MapPin, MessageCircle, Ruler, Trash2 } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  getPropertyOptionLabel,
  propertyIntents,
  propertyStatuses,
  propertyTypes
} from "@/features/properties/constants";
import type { Property } from "@/lib/types";
import { createWhatsappUrl, formatCurrency } from "@/lib/utils";

export function PropertyCard({
  property,
  onEdit,
  onDelete,
  isDeleting
}: {
  property: Property;
  onEdit: (property: Property) => void;
  onDelete: (property: Property) => void;
  isDeleting: boolean;
}) {
  const imageUrl = property.image_urls?.[0] ?? "/icon.svg";

  return (
    <Card className="overflow-hidden">
      <div className="relative aspect-[4/3] bg-muted">
        <Image
          src={imageUrl}
          alt={property.title}
          fill
          className={imageUrl === "/icon.svg" ? "object-contain p-10" : "object-cover"}
          sizes="(min-width: 768px) 50vw, 100vw"
        />
        <div className="absolute left-3 top-3 flex flex-wrap gap-2">
          <Badge variant={property.status === "available" ? "success" : "secondary"}>
            {getPropertyOptionLabel(propertyStatuses, property.status)}
          </Badge>
          <Badge variant="gold">{getPropertyOptionLabel(propertyIntents, property.intent)}</Badge>
        </div>
      </div>

      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h3 className="line-clamp-1 font-semibold">{property.title}</h3>
            <p className="mt-1 flex items-center gap-1 text-sm text-muted-foreground">
              <MapPin className="size-4 shrink-0" />
              <span className="truncate">{property.location}</span>
            </p>
          </div>
          <p className="shrink-0 text-right text-lg font-bold">{formatCurrency(property.price)}</p>
        </div>

        <div className="mt-3 flex flex-wrap gap-2">
          <Badge variant="outline">{getPropertyOptionLabel(propertyTypes, property.type)}</Badge>
          {property.bedrooms ? (
            <Badge variant="outline">
              <BedDouble className="mr-1 size-3" />
              {property.bedrooms} BHK
            </Badge>
          ) : null}
          {property.area_sqft ? (
            <Badge variant="outline">
              <Ruler className="mr-1 size-3" />
              {property.area_sqft} sqft
            </Badge>
          ) : null}
        </div>

        {property.notes ? <p className="mt-3 line-clamp-2 text-sm text-muted-foreground">{property.notes}</p> : null}

        <div className="mt-4 flex flex-wrap justify-between gap-2">
          <div className="min-w-0 text-sm text-muted-foreground">
            <p className="truncate">{property.owner_name || "Owner pending"}</p>
            <p className="truncate">{property.owner_phone || "Phone pending"}</p>
          </div>
          <div className="flex gap-2">
            <Button size="icon" variant="outline" aria-label={`Edit ${property.title}`} onClick={() => onEdit(property)}>
              <Edit className="size-4" />
            </Button>
            <Button
              size="icon"
              variant="outline"
              aria-label={`Delete ${property.title}`}
              onClick={() => onDelete(property)}
              disabled={isDeleting}
            >
              <Trash2 className="size-4" />
            </Button>
            {property.owner_phone ? (
              <Button size="sm" variant="success" asChild>
                <a
                  href={createWhatsappUrl(
                    property.owner_phone,
                    `Hi, checking availability for ${property.title} in ${property.location}.`
                  )}
                  target="_blank"
                  rel="noreferrer"
                >
                  <MessageCircle className="size-4" />
                  WhatsApp
                </a>
              </Button>
            ) : null}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
