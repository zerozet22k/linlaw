import "server-only";

import RelatedBusinessService from "@/services/RelatedBusinessService";
import type { RelatedBusinessAPI } from "@/models/RelatedBusinessModel";

const toPlain = (v: unknown) => JSON.parse(JSON.stringify(v));
const getEn = (obj: any) => String(obj?.en ?? "").trim();

export async function getPublicRelatedBusinesses(opts?: {
  limit?: number;
  fetchLimit?: number;
  includeInactive?: boolean;
}) {
  const limit = Math.max(1, opts?.limit ?? 6);
  const fetchLimit = Math.min(100, Math.max(limit, opts?.fetchLimit ?? 50));
  const includeInactive = !!opts?.includeInactive;

  try {
    const service = new RelatedBusinessService();

    const { businesses } = await service.getAllBusinesses(
      "",          // search
      1,           // page
      fetchLimit,  // limit
      [],          // selected
      includeInactive
    );

    const top = [...(businesses ?? [])]
      .filter(Boolean)
      .sort((a: any, b: any) => {
        const aActive = a.isActive ? 1 : 0;
        const bActive = b.isActive ? 1 : 0;
        if (bActive !== aActive) return bActive - aActive;

        const ao = typeof a.order === "number" ? a.order : 0;
        const bo = typeof b.order === "number" ? b.order : 0;
        if (ao !== bo) return ao - bo;

        return getEn(a.title).localeCompare(getEn(b.title));
      })
      .slice(0, limit);

    return toPlain(top) as RelatedBusinessAPI[];
  } catch (e) {
    console.error("Failed to fetch related businesses:", e);
    return [] as RelatedBusinessAPI[];
  }
}
