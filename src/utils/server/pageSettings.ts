// src/utils/server/pageSettings.ts
import "server-only";
import PageService from "@/services/PageService";
import { PagesInterface, ValidPageSettingKey } from "@/config/CMS/pages/pageKeys";

export async function getPageSettings<
  K extends ValidPageSettingKey,
  D extends Partial<Record<K, any>>
>(args: { keys: readonly K[]; defaults: D }) {
  const pageService = new PageService();
  const fetched = await pageService.getPagesByKeys([...args.keys]);

  return {
    ...args.defaults,
    ...(fetched as unknown as Partial<Record<K, PagesInterface[K]>>),
  } as D & Partial<Record<K, PagesInterface[K]>>;
}
