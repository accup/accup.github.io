<script setup lang="ts">
import PlanetMenuPresentation from "./presentations/planet-menu/PlanetMenuPresentation.vue";

import { appRoot } from "./App.css";
</script>

<template>
  <div :class="appRoot">
    <PlanetMenuPresentation />
  </div>
</template>
