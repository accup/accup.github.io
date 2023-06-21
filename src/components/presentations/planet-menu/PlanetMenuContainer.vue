<script setup lang="ts">
import PlanetMenu from "./@components/PlanetMenu.vue";
import PlanetMenuItemMercuryContainer from "./planet-menu-item/planet-menu-item-mercury/PlanetMenuItemMercuryContainer.vue";
import PlanetMenuItemVenusContainer from "./planet-menu-item/planet-menu-item-venus/PlanetMenuItemVenusContainer.vue";
</script>

<template>
  <PlanetMenu>
    <template #item-mercury><PlanetMenuItemMercuryContainer /> </template>
    <template #item-venus><PlanetMenuItemVenusContainer /> </template>
  </PlanetMenu>
</template>
