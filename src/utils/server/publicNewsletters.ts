import "server-only";

import NewsletterService from "@/services/NewsletterService";
import type { INewsletterAPI } from "@/models/Newsletter";

const toPlain = (v: unknown) => JSON.parse(JSON.stringify(v));

export async function getPublicNewsletters(opts?: {
  limit?: number;
  search?: string;
}) {
  const limit = Math.min(24, Math.max(1, opts?.limit ?? 6));
  const search = opts?.search ?? "";

  try {
    const service = new NewsletterService();
    const { newsletters } = await service.getAllNewsletters(search, 1, limit);

    // Safety sort: newest first
    const sorted = [...(newsletters ?? [])].sort((a: any, b: any) => {
      const ad = a?.createdAt ? new Date(a.createdAt).getTime() : 0;
      const bd = b?.createdAt ? new Date(b.createdAt).getTime() : 0;
      return bd - ad;
    });

    return toPlain(sorted) as INewsletterAPI[];
  } catch (e) {
    console.error("Failed to fetch newsletters:", e);
    return [] as INewsletterAPI[];
  }
}
