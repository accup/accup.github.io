import { useCallback, useState } from "react";
import type { InitializeState } from "./state";

export interface UseArrayStateKitProps<T> {
  readonly initialize?: InitializeState<readonly T[]> | undefined;
}

export interface ArrayStateKit<T> {
  items: readonly T[];
  replaceItems(state: readonly T[]): void;
  appendItem(item: T): void;
  insertItem(index: number, item: T): void;
  updateItem(index: number, item: T): void;
  removeItem(index: number): void;
}

export function useArrayStateKit<T>(
  props?: UseArrayStateKitProps<T> | undefined,
): ArrayStateKit<T> {
  const { initialize = [] } = props ?? {};

  const [items, replaceItems] = useState(initialize);

  const appendItem = useCallback(
    (item: T) => {
      replaceItems((prevArray) => [...prevArray, item]);
    },
    [replaceItems],
  );
  const insertItem = useCallback(
    (index: number, item: T) => {
      replaceItems((prevArray) => prevArray.toSpliced(index, 0, item));
    },
    [replaceItems],
  );
  const updateItem = useCallback(
    (index: number, item: T) => {
      replaceItems((prevArray) => prevArray.toSpliced(index, 1, item));
    },
    [replaceItems],
  );
  const removeItem = useCallback(
    (index: number) => {
      replaceItems((prevArray) => prevArray.toSpliced(index, 1));
    },
    [replaceItems],
  );

  return {
    items,
    replaceItems,
    appendItem,
    insertItem,
    updateItem,
    removeItem,
  };
}
