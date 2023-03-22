<script setup lang="ts">
import {
  planetMenuItemMercuryButton,
  planetMenuItemMercuryCanvas,
  planetMenuItemMercuryListItem,
  planetMenuItemMercurySvg,
  planetMenuItemMercurySvgText,
} from "./PlanetMenuItemMercury.css";
</script>

<template>
  <li :class="planetMenuItemMercuryListItem">
    <button type="button" :class="planetMenuItemMercuryButton">
      <svg
        viewBox="0 0 100 100"
        preserveAspectRatio="meet xMidYMid"
        xmlns="http://www.w3.org/2000/svg"
        :class="planetMenuItemMercurySvg"
      >
        <text x="65" y="60" :class="planetMenuItemMercurySvgText">Mercury</text>
      </svg>
      <canvas :class="planetMenuItemMercuryCanvas" />
    </button>
  </li>
</template>
