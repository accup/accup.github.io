<script setup lang="ts">
import { planetMenuList, planetMenuNav } from "./PlanetMenu.css";
</script>

<template>
  <nav :class="planetMenuNav">
    <ul :class="planetMenuList">
      <slot />
    </ul>
  </nav>
</template>
