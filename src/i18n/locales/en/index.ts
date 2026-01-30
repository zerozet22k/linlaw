import { contact } from "./contact";
import { common } from "./common";
import { title } from "./title";

import { relatedBusinesses } from "./relatedBusinesses";
import { newsletter } from "./newsletter";
import { career } from "./career";
import { team } from "./team";
import { faq } from "./faq";
import { aboutUs } from "./aboutUs";

export const en = {
  contact,
  common,
  title,
  relatedBusinesses,
  newsletter,
  career,
  team,
  faq,
  aboutUs,
} as const;

type DeepWiden<T> =
  T extends string ? string :
  T extends number ? number :
  T extends boolean ? boolean :
  T extends null ? null :
  T extends undefined ? undefined :
  T extends readonly (infer U)[] ? readonly DeepWiden<U>[] :
  T extends object ? { [K in keyof T]: DeepWiden<T[K]> } :
  T;

export type BaseLocale = DeepWiden<typeof en>;
