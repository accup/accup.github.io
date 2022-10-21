type ReadonlyEntryLike = readonly [string, unknown];

type ReadonlyObjectLike = { readonly [x: string]: unknown };

type Entry<T extends ReadonlyObjectLike> = {
  readonly [K in keyof T]: readonly [K, T[K]];
}[keyof T];

type KeyValueMap<E extends ReadonlyEntryLike> = {
  [K in E[0]]: Exclude<T, readonly [Exclude<E[0], K>, unknown]>[1];
};

declare interface ObjectConstructor {
  entries<T extends ReadonlyObjectLike>(object: T): Entry<T>[];
  fromEntries<E extends ReadonlyEntryLike>(entries: E[]): KeyValueMap<E>;
}
