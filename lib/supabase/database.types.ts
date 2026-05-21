export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type Database = {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          email: string;
          full_name: string | null;
          company_name: string | null;
          phone: string | null;
          avatar_url: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email: string;
          full_name?: string | null;
          company_name?: string | null;
          phone?: string | null;
          avatar_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["users"]["Insert"]>;
        Relationships: [];
      };
      clients: {
        Row: {
          id: string;
          user_id: string;
          full_name: string;
          phone: string;
          email: string | null;
          type: "buyer" | "tenant" | "owner" | "investor";
          requirement_type: "rent" | "buy" | null;
          bhk: number | null;
          furnished_type: "unfurnished" | "semi_furnished" | "fully_furnished" | null;
          status: "lead" | "active" | "hot" | "closed" | "lost";
          budget: number | null;
          budget_min: number | null;
          budget_max: number | null;
          preferred_location: string | null;
          preferred_locations: string[] | null;
          notes: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          full_name: string;
          phone: string;
          email?: string | null;
          type?: "buyer" | "tenant" | "owner" | "investor";
          requirement_type?: "rent" | "buy" | null;
          bhk?: number | null;
          furnished_type?: "unfurnished" | "semi_furnished" | "fully_furnished" | null;
          status?: "lead" | "active" | "hot" | "closed" | "lost";
          budget?: number | null;
          budget_min?: number | null;
          budget_max?: number | null;
          preferred_location?: string | null;
          preferred_locations?: string[] | null;
          notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          full_name?: string;
          phone?: string;
          email?: string | null;
          type?: "buyer" | "tenant" | "owner" | "investor";
          requirement_type?: "rent" | "buy" | null;
          bhk?: number | null;
          furnished_type?: "unfurnished" | "semi_furnished" | "fully_furnished" | null;
          status?: "lead" | "active" | "hot" | "closed" | "lost";
          budget?: number | null;
          budget_min?: number | null;
          budget_max?: number | null;
          preferred_location?: string | null;
          preferred_locations?: string[] | null;
          notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      properties: {
        Row: {
          id: string;
          user_id: string;
          title: string;
          type: "apartment" | "villa" | "office" | "shop" | "plot" | "warehouse";
          status: "available" | "reserved" | "leased" | "sold";
          intent: "rent" | "buy";
          location: string;
          address: string | null;
          price: number;
          bedrooms: number | null;
          bathrooms: number | null;
          area_sqft: number | null;
          owner_name: string | null;
          owner_phone: string | null;
          image_urls: string[] | null;
          amenities: string[] | null;
          notes: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          title: string;
          type: "apartment" | "villa" | "office" | "shop" | "plot" | "warehouse";
          status?: "available" | "reserved" | "leased" | "sold";
          intent: "rent" | "buy";
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
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          title?: string;
          type?: "apartment" | "villa" | "office" | "shop" | "plot" | "warehouse";
          status?: "available" | "reserved" | "leased" | "sold";
          intent?: "rent" | "buy";
          location?: string;
          address?: string | null;
          price?: number;
          bedrooms?: number | null;
          bathrooms?: number | null;
          area_sqft?: number | null;
          owner_name?: string | null;
          owner_phone?: string | null;
          image_urls?: string[] | null;
          amenities?: string[] | null;
          notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      requirements: {
        Row: {
          id: string;
          user_id: string;
          client_id: string;
          intent: "rent" | "buy";
          property_type: "apartment" | "villa" | "office" | "shop" | "plot" | "warehouse" | null;
          location: string;
          budget_min: number;
          budget_max: number;
          bedrooms: number | null;
          notes: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["requirements"]["Row"], "id" | "created_at" | "updated_at"> & {
          id?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["requirements"]["Insert"]>;
        Relationships: [];
      };
      followups: {
        Row: {
          id: string;
          user_id: string;
          client_id: string | null;
          property_id: string | null;
          title: string;
          due_at: string;
          status: "pending" | "done" | "missed";
          notes: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["followups"]["Row"], "id" | "created_at" | "updated_at"> & {
          id?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["followups"]["Insert"]>;
        Relationships: [];
      };
      matches: {
        Row: {
          id: string;
          user_id: string;
          requirement_id: string;
          property_id: string;
          score: number;
          notes: string | null;
          created_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["matches"]["Row"], "id" | "created_at"> & {
          id?: string;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["matches"]["Insert"]>;
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
};
