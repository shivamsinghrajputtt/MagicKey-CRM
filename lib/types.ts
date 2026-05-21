export type ClientStatus = "lead" | "active" | "hot" | "closed" | "lost";
export type ClientType = "buyer" | "tenant" | "owner" | "investor";
export type FurnishedType = "unfurnished" | "semi_furnished" | "fully_furnished";
export type PropertyStatus = "available" | "reserved" | "leased" | "sold";
export type PropertyType = "apartment" | "villa" | "office" | "shop" | "plot" | "warehouse";
export type RequirementIntent = "rent" | "buy";
export type FollowupStatus = "pending" | "done" | "missed";

export type Client = {
  id: string;
  full_name: string;
  phone: string;
  email?: string | null;
  type: ClientType;
  requirement_type?: RequirementIntent | null;
  bhk?: number | null;
  furnished_type?: FurnishedType | null;
  status: ClientStatus;
  budget?: number | null;
  budget_min?: number | null;
  budget_max?: number | null;
  preferred_location?: string | null;
  preferred_locations?: string[] | null;
  notes?: string | null;
  created_at: string;
};

export type Property = {
  id: string;
  title: string;
  type: PropertyType;
  status: PropertyStatus;
  intent: RequirementIntent;
  location: string;
  address?: string | null;
  price: number;
  bedrooms?: number | null;
  bathrooms?: number | null;
  area_sqft?: number | null;
  owner_name?: string | null;
  owner_phone?: string | null;
  image_urls?: string[] | null;
  amenities?: string[] | null;
  notes?: string | null;
  created_at: string;
};

export type Requirement = {
  id: string;
  client_id: string;
  intent: RequirementIntent;
  property_type?: PropertyType | null;
  location: string;
  budget_min: number;
  budget_max: number;
  bedrooms?: number | null;
  notes?: string | null;
  created_at: string;
};

export type Followup = {
  id: string;
  client_id?: string | null;
  property_id?: string | null;
  title: string;
  due_at: string;
  status: FollowupStatus;
  notes?: string | null;
};

export type Match = {
  id: string;
  requirement_id: string;
  property_id: string;
  score: number;
  notes?: string | null;
  created_at: string;
};
