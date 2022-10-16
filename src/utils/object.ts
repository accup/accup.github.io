export type Entry<K extends string, V> = [K, V];
export type EntryRecord<T extends Readonly<Record<string, unknown>>> = {
  [K in keyof T]: readonly [K, T[K]];
};
export type EntryOfRecord<T extends Readonly<Record<string, unknown>>> =
  Readonly<EntryRecord<T>>[keyof Readonly<EntryRecord<T>>];
export type RecordOfEntry<T extends Readonly<Entry<string, unknown>>> = {
  [K in T[0]]: Exclude<T, Readonly<Entry<Exclude<T[0], K>, unknown>>>[1];
};

export function entries<T extends Readonly<Record<string, unknown>>>(
  object: T
): EntryOfRecord<T>[] {
  return Object.entries(object) as EntryOfRecord<T>[];
}
export function fromEntries<T extends Readonly<Entry<string, unknown>>>(
  entries: readonly T[]
): RecordOfEntry<T> {
  return Object.fromEntries(entries) as RecordOfEntry<T>;
}
