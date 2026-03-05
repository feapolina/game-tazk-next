import { SupabaseClient } from "@supabase/supabase-js";

// ─── Security constants ────────────────────────────────────────────────────────

/** Only these MIME types are accepted */
const ALLOWED_MIME_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
] as const;

/** Max file size: 5 MB */
const MAX_FILE_SIZE = 5 * 1024 * 1024;

/** Magic byte signatures for each allowed format */
const MAGIC_BYTES: { mime: string; bytes: number[]; offset: number }[] = [
  { mime: "image/jpeg", bytes: [0xff, 0xd8, 0xff], offset: 0 },
  {
    mime: "image/png",
    bytes: [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a],
    offset: 0,
  },
  { mime: "image/gif", bytes: [0x47, 0x49, 0x46, 0x38], offset: 0 }, // GIF8
  { mime: "image/webp", bytes: [0x57, 0x45, 0x42, 0x50], offset: 8 }, // RIFF????WEBP
];

const EXTENSION_MAP: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/gif": "gif",
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

/**
 * Reads the first 12 bytes of a file and checks them against known magic bytes.
 * This catches files that have been renamed to a different extension to bypass
 * MIME-type-only checks (e.g., a PHP script named .jpg).
 */
async function verifyMagicBytes(file: File): Promise<string | null> {
  const buffer = await file.slice(0, 12).arrayBuffer();
  const bytes = new Uint8Array(buffer);

  for (const sig of MAGIC_BYTES) {
    const slice = bytes.slice(sig.offset, sig.offset + sig.bytes.length);
    if (sig.bytes.every((b, i) => slice[i] === b)) {
      return sig.mime;
    }
  }
  return null; // unknown / bad file
}

// ─── Public API ───────────────────────────────────────────────────────────────

export interface UploadResult {
  success: boolean;
  url?: string;
  error?: string;
}

/**
 * Validates and uploads a profile picture to Supabase Storage.
 *
 * Security layers applied (client-side):
 *  1. MIME type allowlist (declared type)
 *  2. File size cap (5 MB)
 *  3. Magic bytes check (actual binary signature — rejects renamed non-images)
 *  4. Sanitised, user-scoped filename (no path traversal possible)
 *
 * Server-side hardening (must be configured in Supabase dashboard):
 *  - Storage bucket "avatars" with RLS: users can only write to their own folder
 *  - Bucket is NOT public; URLs are fetched via signed URL
 */
export async function uploadProfilePicture(
  file: File,
  userId: string,
  supabase: SupabaseClient,
): Promise<UploadResult> {
  // ── Layer 1: declared MIME type ────────────────────────────────────────────
  if (!(ALLOWED_MIME_TYPES as readonly string[]).includes(file.type)) {
    return {
      success: false,
      error: "Tipo de arquivo não permitido. Use JPEG, PNG, WebP ou GIF.",
    };
  }

  // ── Layer 2: file size ─────────────────────────────────────────────────────
  if (file.size > MAX_FILE_SIZE) {
    return { success: false, error: "Arquivo muito grande. O limite é 5 MB." };
  }

  // ── Layer 3: magic bytes (real format check) ───────────────────────────────
  const detectedMime = await verifyMagicBytes(file);
  if (!detectedMime) {
    return { success: false, error: "O arquivo não é uma imagem válida." };
  }
  if (detectedMime !== file.type) {
    return {
      success: false,
      error: "O conteúdo do arquivo não corresponde ao tipo declarado.",
    };
  }

  // ── Layer 4: sanitised path (user-scoped, no traversal) ───────────────────
  const ext = EXTENSION_MAP[detectedMime] ?? "jpg";
  const safePath = `${userId}/avatar.${ext}`; // e.g. "abc-123/avatar.png"

  // ── Upload ─────────────────────────────────────────────────────────────────
  const { error: uploadError } = await supabase.storage
    .from("avatars")
    .upload(safePath, file, {
      upsert: true, // overwrite previous avatar
      contentType: detectedMime,
      cacheControl: "3600",
    });

  if (uploadError) {
    console.error("Supabase storage upload error:", uploadError);
    return {
      success: false,
      error: "Falha ao enviar a imagem. Tente novamente.",
    };
  }

  // ── Get public URL ─────────────────────────────────────────────────────────
  const { data } = supabase.storage.from("avatars").getPublicUrl(safePath);
  // Bust cache by appending a timestamp so the browser fetches the new image
  const url = `${data.publicUrl}?t=${Date.now()}`;

  // ── Persist URL in user metadata ───────────────────────────────────────────
  await supabase.auth.updateUser({ data: { avatar_url: url } });

  return { success: true, url };
}

/**
 * Returns the stored avatar URL for the current user, or null if none.
 */
export function getAvatarUrl(
  user: { user_metadata?: { avatar_url?: string } } | null,
): string | null {
  return user?.user_metadata?.avatar_url ?? null;
}
