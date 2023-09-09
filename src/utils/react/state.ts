export type InitializeState<T> = T | (() => T);

function isCallableInitializer(
  initializer: unknown,
): initializer is () => unknown {
  return typeof initializer === "function";
}

export function useInitialState<T>(initializer: InitializeState<T>): T {
  if (isCallableInitializer(initializer)) {
    return initializer();
  } else {
    return initializer;
  }
}
