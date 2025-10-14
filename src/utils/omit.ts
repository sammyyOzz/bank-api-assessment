export function omit<T extends Record<string, any>, K extends keyof T>(
  obj: T,
  keys: K[],
): Omit<T, K> {
  const keysToOmit = new Set(keys);
  return Object.fromEntries(
    Object.entries(obj).filter(([key]) => !keysToOmit.has(key as K)),
  ) as Omit<T, K>;
}
