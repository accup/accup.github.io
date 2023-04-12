<script setup lang="ts">
import * as styles from "./PlanetMenuItemMercury.css";
</script>

<template>
  <button type="button" :class="styles.button">
    <span :class="styles.text">Mercury</span>
    <canvas :class="styles.canvas" />
  </button>
</template>
