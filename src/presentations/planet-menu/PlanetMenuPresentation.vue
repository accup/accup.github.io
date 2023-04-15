<script setup lang="ts">
import PlanetMenu from "./@components/PlanetMenu.vue";
import PlanetMenuItemMercuryPresentation from "./planet-menu-item-mercury/PlanetMenuItemMercuryPresentation.vue";
</script>

<template>
  <PlanetMenu>
    <template #item-mercury>
      <PlanetMenuItemMercuryPresentation />
    </template>
  </PlanetMenu>
</template>
