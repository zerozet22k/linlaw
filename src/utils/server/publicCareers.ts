import "server-only";

import CareerService from "@/services/CareerService";
import type { CareerAPI } from "@/models/CareerModel";

const toPlain = (value: unknown) => JSON.parse(JSON.stringify(value));

export async function getPublicCareers(opts?: { limit?: number }) {
  const limit = Math.min(100, Math.max(1, opts?.limit ?? 50));

  try {
    const service = new CareerService();
    const { careers } = await service.getAllCareers("", 1, limit);

    return toPlain(careers) as CareerAPI[];
  } catch (error) {
    console.error("Failed to fetch careers:", error);
    return [] as CareerAPI[];
  }
}
