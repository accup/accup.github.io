<template>
  <slot></slot>
</template>

<script lang="ts">
import { defineComponent, computed, provide, inject, ref } from "vue";
import type { Ref } from "vue";
import { fromEntries } from "../../utils/object";

const provided = {
  search: Symbol(),
  map: Symbol(),
} as const;

type ReactiveMap = Map<string, Ref<string | null>>;
type RefParam = Ref<string | null>;

function newRefParam(
  search: URLSearchParams,
  map: ReactiveMap,
  name: string
): RefParam {
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
  map.set(name, refParam);
  return refParam;
}

function useRefParam(
  search: URLSearchParams,
  map: ReactiveMap,
  name: string
): RefParam {
  return map.get(name) ?? newRefParam(search, map, name);
}

function prepare() {
  const search = new URLSearchParams(location.search);
  const map = new Map<string, RefParam>();
  provide<URLSearchParams>(provided.search, search);
  provide<ReactiveMap>(provided.map, map);
}

export function useSearchParam(name: string): RefParam {
  const search = inject<URLSearchParams>(provided.search);
  const map = inject<ReactiveMap>(provided.map);
  if (search == null || map == null) {
    throw new Error(`Not prepared`);
  }

  return useRefParam(search, map, name);
}

export function useSearchParams<T extends readonly string[]>(
  names: T
): { [K in T[number]]: RefParam } {
  return fromEntries<readonly [T[number], RefParam]>(
    names.map((name) => [name, useSearchParam(name)] as const)
  );
}

export default defineComponent({
  setup() {
    prepare();
  },
});
</script>
