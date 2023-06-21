<script setup lang="ts">
import IMask from "imask";
import { ref, watchEffect } from "vue";

import PlanetMenuItem from "../@components/PlanetMenuItem.vue";

import fragmentShader from "./@shaders/PlanetMenuItemVenus.frag?raw";

import { input, label } from "./PlanetMenuItemVenusPresentation.css";

const refInput = ref<HTMLElement>();

watchEffect((cleanUp) => {
  const input = refInput.value;
  if (input == null) return;

  const mask = IMask(input, {
    mask: Number,
    scale: 0,
    radix: ".",
    thousandsSeparator: ",",
    normalizeZeros: true,
    min: -9_999_999,
    max: 9_999_999,
  });
  mask.updateControl();

  cleanUp(() => {
    mask.destroy();
  });
});
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
      <input
        ref="refInput"
        :class="input"
        value="100000"
        type="text"
        pattern="[\d,]+"
      />
    </label>
  </PlanetMenuItem>
</template>
