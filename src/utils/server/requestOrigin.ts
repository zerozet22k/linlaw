import "server-only";
import { headers } from "next/headers";

function first(v: string) {
  return v.split(",")[0]?.trim() || "";
}

export async function getRequestOrigin(): Promise<string> {
  const h = await headers();
  const host = first(h.get("x-forwarded-host") || h.get("host") || "");
  const proto = first(h.get("x-forwarded-proto") || "https");
  return host ? `${proto}://${host}` : "";
}
