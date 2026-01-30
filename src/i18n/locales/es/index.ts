import { contact } from "./contact";
import { common } from "./common";
import { title } from "./title";

import type { BaseLocale } from "../en/index";

export const es = { contact, common, title } as const satisfies BaseLocale;
