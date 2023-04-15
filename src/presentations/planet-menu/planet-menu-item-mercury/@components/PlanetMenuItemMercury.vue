<script setup lang="ts">
import { IUniform, Mesh, RawShaderMaterial, SphereGeometry } from "three";

import { useThreeAnimation } from "../../../../hooks/three/useThreeAnimation";
import fragmentShader from "../@shaders/PlanetMenuItemMercury.frag?raw";
import vertexShader from "../@shaders/PlanetMenuItemMercury.vert?raw";

import * as styles from "./PlanetMenuItemMercury.css";

type Uniforms = {
  u_time: IUniform<number>;
};

const uniforms: Uniforms = {
  u_time: { value: 0 },
};

const { refContainer } = useThreeAnimation({
  setup: ({ graphics: { scene } }) => {
    const geometry = new SphereGeometry(1, 32, 32);
    const material = new RawShaderMaterial({
      uniforms,
      vertexShader,
      fragmentShader,
      transparent: true,
    });

    const mesh = new Mesh(geometry, material);
    mesh.position.set(0, 0, -2);

    scene.add(mesh);
  },
  loop: ({ animation: { animationTimeMs } }) => {
    uniforms.u_time.value = animationTimeMs;
  },
});
</script>

<template>
  <button type="button" :class="styles.button">
    <div ref="refContainer" :class="styles.container" />
    <span :class="styles.text">Mercury</span>
  </button>
</template>
