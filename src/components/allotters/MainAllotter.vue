<script setup lang="ts">
import { watchEffect } from "vue";
import { useSearchParams } from "../contexts/SearchParamsContext.vue";
import UnderConstruction from "../contents/main/UnderConstruction.vue";

const params = useSearchParams(["under"] as const);

watchEffect(() => {
  if (params.under.value !== "construction") {
    params.under.value = "construction";
  }
});
</script>

<template>
  <template v-if="params.under.value != null">
    <UnderConstruction />
  </template>
</template>
