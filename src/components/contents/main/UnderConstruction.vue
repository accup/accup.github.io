<script setup lang="ts">
import { onMounted, ref } from "vue";

const ellipsisCount = ref<number>(0);
const maxEllipsisCount = ref<number>(4);

onMounted(() => {
  const timer = setInterval(() => {
    ellipsisCount.value = (ellipsisCount.value + 1) % maxEllipsisCount.value;
  }, 250);
  const listener = (e: Event) => {
    e.preventDefault();
    ellipsisCount.value++;
    maxEllipsisCount.value++;
  };
  window.addEventListener("mousedown", listener);
  window.addEventListener("touchstart", listener);

  return () => {
    clearInterval(timer);
    window.removeEventListener("mousedown", listener);
    window.removeEventListener("touchstart", listener);
  };
});
</script>

<template>
  <main>UNDER CONSTRUCTION{{ ".".repeat(ellipsisCount) }}🖊</main>
</template>
