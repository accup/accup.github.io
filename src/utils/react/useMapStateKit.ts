import { useCallback, useState } from "react";

import type { InitializeState } from "./state";

export interface UseMapStateKitProps<K, T> {
  readonly initialize?: InitializeState<ReadonlyMap<K, T>> | undefined;
}

export interface MapStateKit<K, T> {
  map: ReadonlyMap<K, T>;
  replaceMap(state: ReadonlyMap<K, T>): void;
  setItem(key: K, item: T): void;
  removeItem(key: K): void;
}

export function useMapStateKit<K, T>(
  props?: UseMapStateKitProps<K, T> | undefined,
): MapStateKit<K, T> {
  const { initialize = () => new Map<K, T>() } = props ?? {};

  const [map, replaceMap] = useState(initialize);

  const setItem = useCallback(
    (key: K, item: T) => {
      replaceMap((prevMap) => {
        const map = new Map(prevMap);
        map.set(key, item);
        return map;
      });
    },
    [replaceMap],
  );
  const removeItem = useCallback(
    (key: K) => {
      replaceMap((prevMap) => {
        const map = new Map(prevMap);
        map.delete(key);
        return map;
      });
    },
    [replaceMap],
  );

  return {
    map,
    replaceMap,
    setItem,
    removeItem,
  };
}
