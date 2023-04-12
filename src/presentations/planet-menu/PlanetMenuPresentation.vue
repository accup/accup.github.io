<script setup lang="ts">
import PlanetMenu from "./@components/PlanetMenu.vue";
import PlanetMenuItemMercury from "./@components/PlanetMenuItemMercury.vue";
</script>

<template>
  <PlanetMenu>
    <template #item-mercury>
      <PlanetMenuItemMercury />
    </template>
    <template #item-venus>Venus</template>
  </PlanetMenu>
</template>
