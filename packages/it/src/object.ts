type ReadonlyEntryLike = readonly [string, unknown];

type ReadonlyObjectLike = { readonly [x: string]: unknown };

type Entry<T extends ReadonlyObjectLike> = {
  readonly [K in keyof T]: readonly [K, T[K]];
}[keyof T];

type KeyValueMap<E extends ReadonlyEntryLike> = {
  [K in E[0]]: Exclude<E, readonly [Exclude<E[0], K>, unknown]>[1];
};

export function entries<T extends ReadonlyObjectLike>(object: T): Entry<T>[] {
  return Object.entries(object) as Entry<T>[];
}

export function fromEntries<E extends ReadonlyEntryLike>(
  entries: readonly E[]
): KeyValueMap<E> {
  return Object.fromEntries(entries) as KeyValueMap<E>;
}
