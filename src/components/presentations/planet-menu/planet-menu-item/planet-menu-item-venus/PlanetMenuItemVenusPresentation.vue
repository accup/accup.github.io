<script setup lang="ts">
import IMask from "imask";
import { ref, watchEffect } from "vue";

import PlanetMenuItem from "../@components/PlanetMenuItem.vue";

import fragmentShader from "./@shaders/PlanetMenuItemVenus.frag?raw";

import { input, label, value } from "./PlanetMenuItemVenusPresentation.css";

const refInput = ref<HTMLInputElement>();
const refValue = ref<string>("3141592");

watchEffect((cleanUp) => {
  const input = refInput.value;
  if (input == null) return;

  const mask = IMask(input, {
    mask: Number,
    scale: 0,
    radix: ".",
    thousandsSeparator: ",",
    normalizeZeros: true,
    min: -999_999_999_999_999,
    max: 999_999_999_999_999,
  });
  mask.on("complete", () => {
    refValue.value = mask.value;
  });

  refValue.value = mask.value;

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
        :value="refValue"
        :class="input"
        type="text"
        pattern="[\d,]+"
      />
      <span :class="value">{{ refValue }}</span>
    </label>
  </PlanetMenuItem>
</template>
