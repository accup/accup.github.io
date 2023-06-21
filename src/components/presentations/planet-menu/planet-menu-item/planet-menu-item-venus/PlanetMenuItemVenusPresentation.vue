<script setup lang="ts">
import PlanetMenuItem from "../@components/PlanetMenuItem.vue";

import fragmentShader from "./@shaders/PlanetMenuItemVenus.frag?raw";

import { input, label } from "./PlanetMenuItemVenusPresentation.css";
</script>

<template>
  <PlanetMenuItem
    :orbital-inclination-degree="7.01"
    :axial-tilt-degree="0.01"
    :rotation-period-days="58.7"
    :fragment-shader="fragmentShader"
  >
    <label :class="label">
      <span>金星</span>
      <input :class="input" type="text" pattern="[\d,]+" />
    </label>
  </PlanetMenuItem>
</template>
