import { MEDIA_BUCKET, supabase } from "@/lib/supabase";

// Photos from phones are often 5–10 MB. They are shrunk in the browser before upload so pages
// stay fast and the storage quota lasts. PNG stays PNG (logos need transparency).

const MAX_SIDE = 2000;

function loadBitmap(file: File): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      URL.revokeObjectURL(url);
      resolve(img);
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("Gambar tidak bisa dibaca"));
    };
    img.src = url;
  });
}

export async function shrinkImage(file: File, maxSide = MAX_SIDE): Promise<Blob> {
  const isPng = file.type === "image/png";
  if (isPng && file.size < 1_500_000) return file;
  const img = await loadBitmap(file);
  const scale = Math.min(1, maxSide / Math.max(img.naturalWidth, img.naturalHeight));
  if (scale === 1 && file.size < 1_500_000) return file;
  const canvas = document.createElement("canvas");
  canvas.width = Math.round(img.naturalWidth * scale);
  canvas.height = Math.round(img.naturalHeight * scale);
  canvas.getContext("2d")!.drawImage(img, 0, 0, canvas.width, canvas.height);
  const type = isPng ? "image/png" : "image/jpeg";
  return new Promise((resolve, reject) =>
    canvas.toBlob((b) => (b ? resolve(b) : reject(new Error("Gagal mengecilkan gambar"))), type, 0.82),
  );
}

/** Uploads to the public "media" bucket and returns the public URL. Admin-only (storage policies). */
export async function uploadImage(file: File, folder: string): Promise<string> {
  if (!supabase) throw new Error("Database belum tersambung");
  if (!/^image\/(jpeg|png|webp)$/.test(file.type)) throw new Error("Format harus JPG, PNG, atau WEBP");
  const blob = await shrinkImage(file);
  const ext = blob.type === "image/png" ? "png" : "jpg";
  const name = `${folder}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
  const { error } = await supabase.storage.from(MEDIA_BUCKET).upload(name, blob, {
    contentType: blob.type,
    cacheControl: "31536000",
    upsert: false,
  });
  if (error) throw new Error(error.message);
  return supabase.storage.from(MEDIA_BUCKET).getPublicUrl(name).data.publicUrl;
}
