<script setup lang="ts">
import {
  IUniform,
  Mesh,
  RawShaderMaterial,
  SphereGeometry,
  Vector3,
} from "three";
import { degToRad } from "three/src/math/MathUtils";
import { watchEffect } from "vue";

import { useThreeAnimation } from "../../../../hooks/three/useThreeAnimation";
import vertexShader from "../@shaders/PlanetMenuItem.vert?raw";

import * as styles from "./PlanetMenuItem.css";

const props = defineProps<{
  orbitalInclinationDegree: number;
  axialTiltDegree: number;
  rotationPeriodDays: number;
  fragmentShader: string;
}>();

type Uniforms = {
  u_time: IUniform<number>;
};

const uniforms: Uniforms = {
  u_time: { value: 0 },
};
const geometry = new SphereGeometry(1, 64, 64);
const mesh = new Mesh(geometry, undefined);
watchEffect(() => {
  mesh.material = new RawShaderMaterial({
    uniforms,
    vertexShader,
    fragmentShader: props.fragmentShader,
    transparent: true,
  });
});

const { refContainer } = useThreeAnimation({
  setup: ({ graphics: { scene, camera } }) => {
    scene.add(mesh);
    camera.position.setFromCylindricalCoords(2.0, 0, 0);
  },
  loop: ({ animation: { animationTimeMs } }) => {
    mesh.setRotationFromAxisAngle(
      new Vector3().setFromSphericalCoords(
        1.0,
        degToRad(props.orbitalInclinationDegree + props.axialTiltDegree),
        degToRad(90)
      ),
      (1e-3 * animationTimeMs) / props.rotationPeriodDays
    );
    uniforms.u_time.value = animationTimeMs;
  },
});
</script>

<template>
  <button type="button" :class="styles.button">
    <div ref="refContainer" :class="styles.container" />
    <span :class="styles.text">
      <slot />
    </span>
  </button>
</template>
