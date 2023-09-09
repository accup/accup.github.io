import { PerspectiveCamera, Scene, Vector2, WebGLRenderer } from "three";
import { type ShallowRef, shallowRef, watchEffect } from "vue";

import {
  type AnimationLoopCallbackProps,
  useAnimationLoop,
} from "../animation-loop/useAnimationLoop";

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
  /**
   * DOM 要素を参照すると子要素としてアニメーション描画先の Canvas が配置される
   */
  readonly refContainer: ShallowRef<HTMLElement | undefined>;
}

export type ThreeAnimationSetup = (props: { graphics: Graphics }) => void;

export type ThreeAnimationLoop = (props: {
  graphics: Graphics;
  animation: AnimationLoopCallbackProps;
}) => void;

export interface ThreeAnimationProps {
  setup?: ThreeAnimationSetup;
  loop: ThreeAnimationLoop;
}

export function useThreeAnimation({
  setup,
  loop,
}: ThreeAnimationProps): ThreeAnimation {
  const refContainer = shallowRef<HTMLElement>();
  const refContainerSize = shallowRef<CanvasSize>();
  const refGraphics = shallowRef<Graphics>();
  const animationLoop = useAnimationLoop();

  watchEffect((onCleanup) => {
    const container = refContainer.value;
    if (container == null) {
      return;
    }

    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const [contentBoxSize] = entry.contentBoxSize;
        if (contentBoxSize == null) continue;

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

    const graphics: Graphics = {
      scene,
      renderer,
      camera,
    };

    setup?.({ graphics });

    animationLoop.set((animation) => {
      const containerSize = refContainerSize.value;
      const size = renderer.getSize(new Vector2());
      if (containerSize != null) {
        if (
          size.width != containerSize.width ||
          size.height != containerSize.height
        ) {
          camera.aspect = containerSize.width / containerSize.height;
          camera.updateProjectionMatrix();
          renderer.setSize(containerSize.width, containerSize.height);
        }
      }

      loop({ graphics, animation });
      renderer.render(scene, camera);
    });

    refGraphics.value = graphics;

    onCleanup(() => {
      animationLoop.unset();
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

  return { refContainer };
}
