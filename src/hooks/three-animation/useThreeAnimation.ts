import {
  BoxGeometry,
  DirectionalLight,
  MathUtils,
  Mesh,
  MeshLambertMaterial,
  PerspectiveCamera,
  Scene,
  WebGLRenderer,
} from "three";
import { ShallowRef, shallowRef, watchEffect } from "vue";

interface CanvasSize {
  readonly width: number;
  readonly height: number;
}

interface Graphics {
  readonly scene: Scene;
  readonly renderer: WebGLRenderer;
  readonly camera: PerspectiveCamera;
}

interface ThreeAnimation {
  readonly refContainer: ShallowRef<HTMLElement | undefined>;
}

export function useThreeAnimation(): ThreeAnimation {
  const refContainer = shallowRef<HTMLElement>();
  const refContainerSize = shallowRef<CanvasSize>();
  const refGraphics = shallowRef<Graphics>();

  watchEffect((onCleanup) => {
    const container = refContainer.value;
    if (container == null) {
      return;
    }

    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const [contentBoxSize] = entry.contentBoxSize;

        refContainerSize.value = {
          width: contentBoxSize.inlineSize,
          height: contentBoxSize.blockSize,
        };
      }
    });
    observer.observe(container);

    onCleanup(() => {
      refContainerSize.value = undefined;
      observer.disconnect();
    });
  });

  watchEffect((onCleanup) => {
    const scene = new Scene();
    const renderer = new WebGLRenderer({ alpha: true });
    renderer.setClearColor("black", 0.0);
    const camera = new PerspectiveCamera(70, 1, 1, 10000);

    renderer.setPixelRatio(window.devicePixelRatio);

    const light = new DirectionalLight(0xffffff, 1);
    light.position.set(1, 1, 1).normalize();
    scene.add(light);

    const geometry = new BoxGeometry(20, 20, 20);

    for (let i = 0; i < 2000; i++) {
      const object = new Mesh(
        geometry,
        new MeshLambertMaterial({ color: Math.random() * 0xffffff })
      );

      object.position.x = Math.random() * 800 - 400;
      object.position.y = Math.random() * 800 - 400;
      object.position.z = Math.random() * 800 - 400;

      object.rotation.x = Math.random() * 2 * Math.PI;
      object.rotation.y = Math.random() * 2 * Math.PI;
      object.rotation.z = Math.random() * 2 * Math.PI;

      object.scale.x = Math.random() + 0.5;
      object.scale.y = Math.random() + 0.5;
      object.scale.z = Math.random() + 0.5;

      scene.add(object);
    }

    let requestedAnimationFrame: number | null = null;
    let theta = 0;
    const radius = 100;
    function animate() {
      theta += 0.1;

      camera.position.x = radius * Math.sin(MathUtils.degToRad(theta));
      camera.position.y = radius * Math.sin(MathUtils.degToRad(theta));
      camera.position.z = radius * Math.cos(MathUtils.degToRad(theta));
      camera.lookAt(scene.position);

      camera.updateMatrixWorld();

      renderer.render(scene, camera);

      requestedAnimationFrame = requestAnimationFrame(animate);
    }

    animate();

    refGraphics.value = {
      scene,
      renderer,
      camera,
    };

    onCleanup(() => {
      if (requestedAnimationFrame != null) {
        cancelAnimationFrame(requestedAnimationFrame);
      }

      refGraphics.value = undefined;
      camera.clear();
      renderer.dispose();
      scene.clear();
    });
  });

  watchEffect((onCleanup) => {
    const container = refContainer.value;
    if (container == null) {
      return;
    }

    const graphics = refGraphics.value;
    if (graphics == null) {
      return;
    }

    container.replaceChildren(graphics.renderer.domElement);

    onCleanup(() => {
      container.replaceChildren();
    });
  });

  watchEffect(() => {
    const containerSize = refContainerSize.value;
    if (containerSize == null) {
      return;
    }

    const graphics = refGraphics.value;
    if (graphics == null) {
      return;
    }

    graphics.camera.aspect = containerSize.width / containerSize.height;
    graphics.camera.updateProjectionMatrix();
    graphics.renderer.setSize(containerSize.width, containerSize.height);
  });

  return { refContainer };
}
