"use client";

import { useState } from "react";
import { ImagePlus, Loader2 } from "lucide-react";

import { createClient } from "@/lib/supabase/client";

export function ImageUpload() {
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);

  async function uploadImage(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    setLoading(true);
    setStatus("");

    const supabase = createClient();
    const {
      data: { user }
    } = await supabase.auth.getUser();

    if (!user) {
      setStatus("Sign in before uploading property photos.");
      setLoading(false);
      return;
    }

    const path = `${user.id}/${crypto.randomUUID()}-${file.name}`;
    const { error } = await supabase.storage.from("property-images").upload(path, file, {
      cacheControl: "3600",
      upsert: false
    });

    setStatus(error ? error.message : "Image uploaded. Save the public URL in the property image_urls field.");
    setLoading(false);
  }

  return (
    <div className="rounded-lg border border-dashed bg-muted/40 p-4">
      <label className="flex cursor-pointer flex-col items-center justify-center gap-2 text-center">
        <input className="sr-only" type="file" accept="image/*" onChange={uploadImage} />
        <span className="flex size-12 items-center justify-center rounded-md bg-background text-muted-foreground">
          {loading ? <Loader2 className="size-5 animate-spin" /> : <ImagePlus className="size-5" />}
        </span>
        <span className="text-sm font-semibold">Upload property image</span>
        <span className="text-xs text-muted-foreground">Stored in Supabase Storage bucket property-images</span>
      </label>
      {status ? <p className="mt-3 rounded-md bg-background p-3 text-sm text-muted-foreground">{status}</p> : null}
    </div>
  );
}
