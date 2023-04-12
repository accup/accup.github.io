<script setup lang="ts">
import { button, canvas, listItem, text } from "./PlanetMenuItemMercury.css";
</script>

<template>
  <li :class="listItem">
    <button type="button" :class="button">
      <span :class="text">Mercury</span>
      <canvas :class="canvas" />
    </button>
  </li>
</template>
