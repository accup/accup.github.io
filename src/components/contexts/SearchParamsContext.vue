<template>
  <slot></slot>
</template>

<script lang="ts">
import {
  defineComponent,
  computed,
  provide,
  inject,
  ref,
  onUnmounted,
} from "vue";
import type { Ref } from "vue";
import { fromEntries } from "@accup/it";

const provided = {
  search: Symbol(),
  nameSymbolMap: Symbol(),
} as const;

type NameSymbolMap = Map<string, symbol>;
type RefParam = Ref<string | null>;
type RefParamProvide = () => void;
type RefParamInject = () => RefParam;
type RefParamsProvide = () => void;
type RefParamsInject<T extends readonly string[]> = () => {
  [K in T[number]]: RefParam;
};

function newRefParam(search: URLSearchParams, name: string): RefParam {
  const url = new URL(location.href);
  const refValue = ref<string | null>(search.get(name));
  const refParam = computed<string | null>({
    get: () => refValue.value,
    set: (value) => {
      refValue.value = value;

      if (value == null) {
        search.delete(name);
      } else {
        search.set(name, value);
      }

      url.search = search.toString();
      history.replaceState(null, "", url);
    },
  });
  return refParam;
}

function prepare() {
  const search = new URLSearchParams(location.search);
  const nameSymbolMap: NameSymbolMap = new Map();
  provide(provided.search, search);
  provide(provided.nameSymbolMap, nameSymbolMap);
}

function injectNameSymbolMap(): NameSymbolMap {
  const nameSymbolMap = inject<NameSymbolMap>(provided.nameSymbolMap);
  if (nameSymbolMap == null) {
    throw new Error(`Search params not prepared`);
  }
  return nameSymbolMap;
}

function newNameSymbol(nameSymbolMap: NameSymbolMap, name: string): symbol {
  const nameSymbol = Symbol();
  nameSymbolMap.set(name, nameSymbol);
  return nameSymbol;
}

function injectBackRefParam(name: string): RefParam | undefined {
  const nameSymbolMap = injectNameSymbolMap();
  const nameSymbol = nameSymbolMap.get(name);
  if (nameSymbol == null) {
    newNameSymbol(nameSymbolMap, name);
    return undefined;
  } else {
    return inject<RefParam>(nameSymbol);
  }
}

function injectNameSymbol(name: string): symbol {
  const nameSymbolMap = injectNameSymbolMap();
  const nameSymbol = nameSymbolMap.get(name);
  if (nameSymbol == null) {
    throw new Error(`Unused search param '${name}'`);
  }
  return nameSymbol;
}

export function defineSearchParamProvider(
  name: string
): [RefParamProvide, RefParamInject] {
  return [
    () => {
      const search = inject<URLSearchParams>(provided.search);
      if (search == null) {
        throw new Error(`Search params not prepared`);
      }

      const backRefParam = injectBackRefParam(name);
      const refParam = newRefParam(search, name);
      provide(injectNameSymbol(name), refParam);

      onUnmounted(() => {
        if (backRefParam == null) return;

        // Restore the search param
        const value = backRefParam.value;
        backRefParam.value = value;
      });
    },
    () => {
      const nameSymbol = injectNameSymbol(name);
      const refParam = inject<RefParam>(nameSymbol);
      if (refParam == null) {
        throw new Error(`Undefined search param '${name}'`);
      }
      return refParam;
    },
  ];
}

export function defineSearchParamsProvider<T extends string>(
  names: readonly T[]
): [RefParamsProvide, RefParamsInject<T[]>] {
  const paramProviderEntries = names.map(
    (name) => [name, defineSearchParamProvider(name)] as const
  );

  return [
    () => paramProviderEntries.forEach(([, [provideParam]]) => provideParam()),
    () =>
      fromEntries(
        paramProviderEntries.map(
          ([name, [, injectParam]]) => [name, injectParam()] as const
        )
      ),
  ];
}

export default defineComponent({
  setup() {
    prepare();
  },
});
</script>
