<script setup lang="ts">
import PlanetMenu from "./@components/PlanetMenu.vue";
import PlanetMenuItemMercuryContainer from "./planet-menu-item/planet-menu-item-mercury/PlanetMenuItemMercuryContainer.vue";
</script>

<template>
  <PlanetMenu>
    <template #item-mercury><PlanetMenuItemMercuryContainer /> </template>
  </PlanetMenu>
</template>
