// src/utils/typed.ts
export function valuesOf<T extends Record<string, string>>(obj: T) {
  return Object.values(obj) as Array<T[keyof T]>;
}
