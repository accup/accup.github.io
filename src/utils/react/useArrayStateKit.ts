import { useCallback, useState } from "react";
import type { InitializeState } from "./state";

export interface UseArrayStateKitProps<T> {
  readonly initialize?: InitializeState<readonly T[]> | undefined;
}

export interface ArrayStateKit<T> {
  state: readonly T[];
  setState(state: readonly T[]): void;
  insertItem(index: number, item: T): void;
  updateItem(index: number, item: T): void;
  removeItem(index: number): void;
}

export function useArrayStateKit<T>(
  props?: UseArrayStateKitProps<T> | undefined,
): ArrayStateKit<T> {
  const { initialize = [] } = props ?? {};

  const [state, setState] = useState(initialize);

  const insertItem = useCallback(
    (index: number, item: T) => {
      setState((prevArray) => prevArray.toSpliced(index, 0, item));
    },
    [setState],
  );
  const updateItem = useCallback(
    (index: number, item: T) => {
      setState((prevArray) => prevArray.toSpliced(index, 1, item));
    },
    [setState],
  );
  const removeItem = useCallback(
    (index: number) => {
      setState((prevArray) => prevArray.toSpliced(index, 1));
    },
    [setState],
  );

  return {
    state,
    setState,
    insertItem,
    updateItem,
    removeItem,
  };
}
