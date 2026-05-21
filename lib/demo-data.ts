import type { Client, Followup, Property, Requirement } from "@/lib/types";

export const demoClients: Client[] = [
  {
    id: "client-1",
    full_name: "Riya Shah",
    phone: "919876543210",
    email: "riya@example.com",
    type: "tenant",
    requirement_type: "rent",
    bhk: 2,
    furnished_type: "semi_furnished",
    status: "hot",
    budget: 85000,
    budget_min: 65000,
    budget_max: 95000,
    preferred_location: "Bandra West",
    preferred_locations: ["Bandra West", "Khar"],
    notes: "Needs pet-friendly apartment before month end.",
    created_at: "2026-05-18T10:00:00Z"
  },
  {
    id: "client-2",
    full_name: "Aman Mehta",
    phone: "919899001122",
    email: "aman@example.com",
    type: "buyer",
    requirement_type: "buy",
    bhk: 3,
    furnished_type: "fully_furnished",
    status: "active",
    budget: 28500000,
    budget_min: 22000000,
    budget_max: 31000000,
    preferred_location: "Powai",
    preferred_locations: ["Powai", "Vikhroli"],
    notes: "Prefers higher floor with lake view.",
    created_at: "2026-05-17T12:30:00Z"
  },
  {
    id: "client-3",
    full_name: "Kavya Iyer",
    phone: "918888777666",
    type: "owner",
    requirement_type: "rent",
    bhk: null,
    furnished_type: "unfurnished",
    status: "lead",
    budget: null,
    budget_min: null,
    budget_max: null,
    preferred_location: "Lower Parel",
    preferred_locations: ["Lower Parel"],
    notes: "Listing inspection scheduled.",
    created_at: "2026-05-15T08:00:00Z"
  }
];

export const demoProperties: Property[] = [
  {
    id: "property-1",
    title: "Sea-facing 2 BHK Residence",
    type: "apartment",
    status: "available",
    intent: "rent",
    location: "Bandra West",
    address: "Carter Road",
    price: 85000,
    bedrooms: 2,
    bathrooms: 2,
    area_sqft: 920,
    owner_name: "N. Kapoor",
    owner_phone: "919820001111",
    image_urls: [
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=900&q=80"
    ],
    amenities: ["Sea view", "Parking", "Pet friendly"],
    notes: "Owner prefers company lease. Available immediately.",
    created_at: "2026-05-18T09:00:00Z"
  },
  {
    id: "property-2",
    title: "Premium Lake View 3 BHK",
    type: "apartment",
    status: "available",
    intent: "buy",
    location: "Powai",
    address: "Hiranandani Gardens",
    price: 28500000,
    bedrooms: 3,
    bathrooms: 3,
    area_sqft: 1450,
    owner_name: "S. Rao",
    owner_phone: "919930002222",
    image_urls: [
      "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=900&q=80"
    ],
    amenities: ["Clubhouse", "Lake view", "Gym"],
    notes: "Ready possession, negotiable for serious buyer.",
    created_at: "2026-05-16T11:00:00Z"
  },
  {
    id: "property-3",
    title: "Road-touch Retail Shop",
    type: "shop",
    status: "reserved",
    intent: "rent",
    location: "Lower Parel",
    address: "High Street",
    price: 180000,
    bedrooms: null,
    bathrooms: 1,
    area_sqft: 510,
    owner_name: "Kavya Iyer",
    owner_phone: "918888777666",
    image_urls: [
      "https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=900&q=80"
    ],
    amenities: ["Main road", "Signage", "High footfall"],
    notes: "Reserved until token confirmation.",
    created_at: "2026-05-14T11:00:00Z"
  }
];

export const demoRequirements: Requirement[] = [
  {
    id: "req-1",
    client_id: "client-1",
    intent: "rent",
    property_type: "apartment",
    location: "Bandra West",
    budget_min: 65000,
    budget_max: 95000,
    bedrooms: 2,
    notes: "Pet friendly, parking required.",
    created_at: "2026-05-18T10:20:00Z"
  },
  {
    id: "req-2",
    client_id: "client-2",
    intent: "buy",
    property_type: "apartment",
    location: "Powai",
    budget_min: 22000000,
    budget_max: 31000000,
    bedrooms: 3,
    notes: "Ready possession preferred.",
    created_at: "2026-05-17T12:40:00Z"
  }
];

export const demoFollowups: Followup[] = [
  {
    id: "followup-1",
    client_id: "client-1",
    property_id: "property-1",
    title: "Send Bandra shortlist on WhatsApp",
    due_at: "2026-05-20T17:30:00+05:30",
    status: "pending"
  },
  {
    id: "followup-2",
    client_id: "client-2",
    property_id: "property-2",
    title: "Confirm Powai site visit",
    due_at: "2026-05-21T11:00:00+05:30",
    status: "pending"
  },
  {
    id: "followup-3",
    client_id: "client-3",
    property_id: "property-3",
    title: "Collect shop keys and photos",
    due_at: "2026-05-22T15:00:00+05:30",
    status: "pending"
  }
];
