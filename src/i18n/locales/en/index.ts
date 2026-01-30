import { contact } from "./contact";
import { common } from "./common";
import { title } from "./title";

export const en = { contact, common, title } as const;

// Turn "Contact Us" literal types into just `string`,
// while preserving exact key structure.
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
