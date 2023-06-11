<script setup lang="ts">
import * as styles from "./PlanetMenu.css";
</script>

<template>
  <nav :class="styles.nav">
    <ul :class="styles.list">
      <li :class="styles.listItem.mercury"><slot name="item-mercury" /></li>
      <li :class="styles.listItem.venus"><slot name="item-venus" /></li>
      <li :class="styles.listItem.earth"><slot name="item-earth" /></li>
      <li :class="styles.listItem.mars"><slot name="item-mars" /></li>
      <li :class="styles.listItem.jupiter"><slot name="item-jupiter" /></li>
      <li :class="styles.listItem.saturn"><slot name="item-saturn" /></li>
      <li :class="styles.listItem.uranus"><slot name="item-uranus" /></li>
      <li :class="styles.listItem.neptune"><slot name="item-neptune" /></li>
    </ul>
  </nav>
</template>
