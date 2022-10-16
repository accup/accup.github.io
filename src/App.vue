<script setup lang="ts">
import SearchParamsContext from "./components/contexts/SearchParamsContext.vue";
import MainContext from "./components/contexts/MainContext.vue";
import MainAllotter from "./components/allotters/MainAllotter.vue";
</script>

<template>
  <SearchParamsContext>
    <MainContext>
      <MainAllotter />
    </MainContext>
  </SearchParamsContext>
</template>
