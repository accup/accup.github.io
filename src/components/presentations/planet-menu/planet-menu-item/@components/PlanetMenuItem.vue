<script setup lang="ts">
import {
  IUniform,
  Mesh,
  RawShaderMaterial,
  SphereGeometry,
  Vector3,
} from "three";
import { computed, watchEffect } from "vue";

import { useThreeAnimation } from "../../../../../hooks/three/useThreeAnimation";
import vertexShader from "../@shaders/PlanetMenuItem.vert?raw";

import * as styles from "./PlanetMenuItem.css";

const RE_VERSION_DIRECTIVE = /^#version\s+(?<version>.*)\n/;

const props = defineProps<{
  href?: string;
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

function degToRad(degree: number): number {
  return (Math.PI * degree) / 180;
}

watchEffect(() => {
  const versionLessVertexShader = vertexShader.replace(
    RE_VERSION_DIRECTIVE,
    ""
  );
  const versionLessFragmentShader = props.fragmentShader.replace(
    RE_VERSION_DIRECTIVE,
    ""
  );
  const glslVersion = RE_VERSION_DIRECTIVE.exec(props.fragmentShader)?.groups
    ?.version;

  mesh.material = new RawShaderMaterial({
    uniforms,
    vertexShader: versionLessVertexShader,
    fragmentShader: versionLessFragmentShader,
    transparent: true,
    glslVersion:
      glslVersion === "100" || glslVersion === "300 es"
        ? glslVersion
        : undefined,
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

const ButtonTag = computed(() => (props.href != null ? "a" : "div"));
</script>

<template>
  <ButtonTag :class="styles.button" v-bind="{ href: props.href }">
    <span ref="refContainer" :class="styles.container" />
    <span :class="styles.text">
      <slot />
    </span>
  </ButtonTag>
</template>
