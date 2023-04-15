<script setup lang="ts">
import { useThreeAnimation } from "../../../hooks/three-animation/useThreeAnimation";

import * as styles from "./PlanetMenuItemMercury.css";

const { refContainer } = useThreeAnimation();
</script>

<template>
  <button type="button" :class="styles.button">
    <span :class="styles.text">Mercury</span>
    <div ref="refContainer" :class="styles.container" />
  </button>
</template>
