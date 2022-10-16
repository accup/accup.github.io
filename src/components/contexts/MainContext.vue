<template>
  <slot></slot>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { defineSearchParamsProvider } from "./SearchParamsContext.vue";

const [provideMainSearchParams, injectMainSearchParams] =
  defineSearchParamsProvider(["under"] as const);

export { injectMainSearchParams };

export default defineComponent({
  setup() {
    provideMainSearchParams();
  },
});
</script>
