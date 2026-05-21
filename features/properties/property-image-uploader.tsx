"use client";

import Image from "next/image";
import { ImagePlus, Loader2, X } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";

export function PropertyImageUploader({
  imageUrls,
  onChange
}: {
  imageUrls: string[];
  onChange: (urls: string[]) => void;
}) {
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function uploadImage(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    setMessage("");
    setLoading(true);

    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      setMessage("Supabase is not configured yet. Add env variables before uploading images.");
      setLoading(false);
      return;
    }

    const supabase = createClient();
    const {
      data: { user },
      error: userError
    } = await supabase.auth.getUser();

    if (userError || !user) {
      setMessage("Sign in before uploading property photos.");
      setLoading(false);
      return;
    }

    const safeName = file.name.replace(/[^\w.-]/g, "-");
    const path = `${user.id}/${crypto.randomUUID()}-${safeName}`;
    const { error } = await supabase.storage.from("property-images").upload(path, file, {
      cacheControl: "3600",
      upsert: false
    });

    if (error) {
      setMessage(error.message);
      setLoading(false);
      return;
    }

    const { data } = supabase.storage.from("property-images").getPublicUrl(path);
    onChange([...imageUrls, data.publicUrl]);
    setMessage("Image uploaded and attached.");
    setLoading(false);
    event.target.value = "";
  }

  function removeImage(url: string) {
    onChange(imageUrls.filter((item) => item !== url));
  }

  return (
    <div className="space-y-3">
      <label className="flex min-h-28 cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border border-dashed bg-muted/40 p-4 text-center">
        <input className="sr-only" type="file" accept="image/png,image/jpeg,image/webp" onChange={uploadImage} />
        <span className="flex size-11 items-center justify-center rounded-md bg-background text-muted-foreground">
          {loading ? <Loader2 className="size-5 animate-spin" /> : <ImagePlus className="size-5" />}
        </span>
        <span className="text-sm font-semibold">Upload property image</span>
        <span className="text-xs text-muted-foreground">Photos are saved to Supabase Storage</span>
      </label>

      {message ? <p className="rounded-md bg-muted p-3 text-sm text-muted-foreground">{message}</p> : null}

      {imageUrls.length ? (
        <div className="grid grid-cols-3 gap-2">
          {imageUrls.map((url) => (
            <div key={url} className="relative aspect-square overflow-hidden rounded-md border bg-muted">
              <Image src={url} alt="Property uploaded preview" fill className="object-cover" sizes="120px" />
              <Button
                className="absolute right-1 top-1 size-8 bg-background/90"
                size="icon"
                variant="ghost"
                type="button"
                aria-label="Remove image"
                onClick={() => removeImage(url)}
              >
                <X className="size-4" />
              </Button>
            </div>
          ))}
        </div>
      ) : null}
    </div>
  );
}
