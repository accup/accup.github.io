import { type Ref, shallowReadonly, shallowRef, watchEffect } from "vue";

interface Disposable {
  dispose(): void;
}

type ThreeDisposableGetter<T extends Disposable> = () => T;

export function useThreeDisposable<T extends Disposable>(
  getter: ThreeDisposableGetter<T>,
): Readonly<Ref<T | undefined>> {
  const refResource = shallowRef<T>();

  watchEffect((onCleanup) => {
    const resource = getter();
    refResource.value = resource;

    onCleanup(() => {
      refResource.value = undefined;
      resource.dispose();
    });
  });

  return shallowReadonly(refResource);
}
