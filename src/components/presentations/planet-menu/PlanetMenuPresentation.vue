<script setup lang="ts">
import PlanetMenu from "./@components/PlanetMenu.vue";
</script>

<template>
  <PlanetMenu>
    <template #item-mercury><slot name="item-mercury" /></template>
    <template #item-venus><slot name="item-venus" /></template>
    <template #item-earth><slot name="item-earth" /></template>
    <template #item-mars><slot name="item-mars" /></template>
    <template #item-jupiter><slot name="item-jupiter" /></template>
    <template #item-saturn><slot name="item-saturn" /></template>
    <template #item-uranus><slot name="item-uranus" /></template>
    <template #item-neptune><slot name="item-neptune" /></template>
  </PlanetMenu>
</template>
