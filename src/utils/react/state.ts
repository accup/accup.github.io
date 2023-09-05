import { useCallback, useState } from "react";

export type InitializeState<T> = T | (() => T);

export interface UseStateProps<T> {
  initialize?: InitializeState<T> | undefined;
}

export function useArrayState<T>(initialize: InitializeState<readonly T[]>) {
  const [array, setArray] = useState(initialize);

  const insertItem = useCallback(
    (index: number, item: T) => {
      setArray((prevArray) => prevArray.toSpliced(index, 0, item));
    },
    [setArray],
  );
  const updateItem = useCallback(
    (index: number, item: T) => {
      setArray((prevArray) => prevArray.toSpliced(index, 1, item));
    },
    [setArray],
  );
  const removeItem = useCallback(
    (index: number) => {
      setArray((prevArray) => prevArray.toSpliced(index, 1));
    },
    [setArray],
  );

  return {
    array,
    setArray,
    insertItem,
    updateItem,
    removeItem,
  };
}
