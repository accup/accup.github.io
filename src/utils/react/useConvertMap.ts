import { useMemo, useRef } from "react";

export interface UseConvertMapProps<K, T, U> {
  map: ReadonlyMap<K, T>;
  convert(key: K, item: T): U;
}

export function useConvertMap<K, T, U>(
  props: UseConvertMapProps<K, T, U>,
): ReadonlyMap<K, U> {
  const { map: originalMap, convert } = props;

  const cacheConvert = useRef<typeof convert | null>(null);
  const cacheMap = useMemo<Map<K, readonly [T, U]>>(() => new Map(), []);

  const convertedMap = useMemo(() => {
    if (convert !== cacheConvert.current) {
      // Clear cache.
      cacheMap.clear();
    }
    cacheConvert.current = convert;

    // Remove expired entries.
    const cacheKeys = [...cacheMap.keys()];

    for (const key of cacheKeys) {
      if (!originalMap.has(key)) {
        cacheMap.delete(key);
      }
    }

    // Set new or updated entries.
    for (const [key, originalItem] of originalMap.entries()) {
      const cachedPair = cacheMap.get(key);

      if (cachedPair == null) {
        cacheMap.set(key, [originalItem, convert(key, originalItem)]);
      } else {
        const [cachedItem] = cachedPair;

        if (originalItem !== cachedItem) {
          cacheMap.set(key, [originalItem, convert(key, originalItem)]);
        }
      }
    }

    return new Map<K, U>(extractCacheConvertedEntries(cacheMap));
  }, [convert, originalMap, cacheConvert, cacheMap]);

  return convertedMap;
}

function* extractCacheConvertedEntries<K, U>(
  cacheMap: ReadonlyMap<K, readonly [unknown, U]>,
): Generator<readonly [K, U]> {
  for (const [key, [, cacheItem]] of cacheMap) {
    yield [key, cacheItem];
  }
}
