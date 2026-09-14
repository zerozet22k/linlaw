const USER_MEDIA_PREFIXES = ["profile_images/", "cover_images/"] as const;

function safeDecode(value: string): string {
  try {
    return decodeURIComponent(value);
  } catch {
    return value;
  }
}

function isAllowedUserMediaPath(value: string): boolean {
  if (!value || value.includes("..") || value.includes("\\")) return false;
  return USER_MEDIA_PREFIXES.some((prefix) => value.startsWith(prefix));
}

/**
 * Extract the Firebase/GCS object path used for profile and cover images.
 * Supports legacy storage.googleapis.com URLs, Firebase download URLs,
 * raw object paths, and the local /api/user-media proxy URL.
 */
export function extractUserMediaPath(src?: string | null): string | null {
  const input = String(src ?? "").trim();
  if (!input) return null;

  if (input.startsWith("/api/user-media")) {
    try {
      const url = new URL(input, "http://localhost");
      const path = safeDecode(String(url.searchParams.get("path") ?? "")).replace(/^\/+/, "");
      return isAllowedUserMediaPath(path) ? path : null;
    } catch {
      return null;
    }
  }

  if (input.startsWith("http://") || input.startsWith("https://")) {
    try {
      const url = new URL(input);
      let path = "";

      if (url.hostname === "storage.googleapis.com") {
        // https://storage.googleapis.com/<bucket>/<object-path>
        const parts = url.pathname.split("/").filter(Boolean);
        if (parts.length < 2) return null;
        path = parts.slice(1).join("/");
      } else if (url.hostname === "firebasestorage.googleapis.com") {
        // https://firebasestorage.googleapis.com/v0/b/<bucket>/o/<encoded-object-path>
        const marker = "/o/";
        const index = url.pathname.indexOf(marker);
        if (index < 0) return null;
        path = url.pathname.slice(index + marker.length);
      } else {
        return null;
      }

      path = safeDecode(path).replace(/^\/+/, "");
      return isAllowedUserMediaPath(path) ? path : null;
    } catch {
      return null;
    }
  }

  const path = safeDecode(input).replace(/^\/+/, "");
  return isAllowedUserMediaPath(path) ? path : null;
}

/**
 * Route Firebase profile/cover images through our own origin so they keep
 * working even when the storage bucket/object itself is not publicly readable.
 */
export function toUserMediaUrl(
  src?: string | null,
  fallback = ""
): string {
  const input = String(src ?? "").trim();
  if (!input) return fallback;

  if (input.startsWith("/api/user-media")) return input;

  const path = extractUserMediaPath(input);
  if (path) return `/api/user-media?path=${encodeURIComponent(path)}`;

  if (
    input.startsWith("http://") ||
    input.startsWith("https://") ||
    input.startsWith("/")
  ) {
    return input;
  }

  return `/${input}`;
}
