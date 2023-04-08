<script setup lang="ts">
import { planetMenuList, planetMenuNav } from "./PlanetMenu.css";
</script>

<template>
  <nav :class="planetMenuNav">
    <ul :class="planetMenuList">
      <li><slot name="item-mercury" /></li>
      <li><slot name="item-venus" /></li>
      <li><slot name="item-earth" /></li>
      <li><slot name="item-mars" /></li>
      <li><slot name="item-jupiter" /></li>
      <li><slot name="item-saturn" /></li>
      <li><slot name="item-uranus" /></li>
      <li><slot name="item-neptune" /></li>
    </ul>
  </nav>
</template>
