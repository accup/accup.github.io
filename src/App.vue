<script setup lang="ts">
import SearchParamsContext from "./components/contexts/SearchParamsContext.vue";
import MainAllotter from "./components/allotters/MainAllotter.vue";
</script>

<template>
  <SearchParamsContext>
    <MainAllotter />
  </SearchParamsContext>
</template>
