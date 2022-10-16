<script setup lang="ts">
import { watchEffect } from "vue";
import { injectMainSearchParams } from "../contexts/MainContext.vue";
import UnderConstruction from "../contents/main/UnderConstruction.vue";

const params = injectMainSearchParams();

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
