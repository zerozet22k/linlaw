import { contact } from "./contact";
import { common } from "./common";
import { title } from "./title";

import { relatedBusinesses } from "./relatedBusinesses";
import { newsletter } from "./newsletter";
import { career } from "./career";
import { team } from "./team";
import { faq } from "./faq";
import { aboutUs } from "./aboutUs";
import { BaseLocale } from "@/i18n/languages";

export const my = {
  contact,
  common,
  title,
  relatedBusinesses,
  newsletter,
  career,
  team,
  faq,
  aboutUs,
} as const satisfies BaseLocale;
