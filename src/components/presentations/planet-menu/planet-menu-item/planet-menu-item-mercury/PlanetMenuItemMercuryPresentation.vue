<script setup lang="ts">
import PlanetMenuItem from "../@components/PlanetMenuItem.vue";

import fragmentShader from "./@shaders/PlanetMenuItemMercury.frag?raw";
</script>

<template>
  <PlanetMenuItem
    href="/wave/"
    :orbital-inclination-degree="7.01"
    :axial-tilt-degree="0.01"
    :rotation-period-days="58.7"
    :fragment-shader="fragmentShader"
  >
    wave
  </PlanetMenuItem>
</template>
