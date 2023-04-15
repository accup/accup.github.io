import { shallowRef, watchEffect } from "vue";

export interface AnimationLoopCallbackProps {
  /**
   * アニメーション開始時点を 0 秒とした秒単位の時刻
   */
  readonly animationTimeMs: number;
  /**
   * 0 ベースのフレーム数
   */
  readonly animationFrame: number;
  /**
   * 直前のコールバック呼出からの経過時刻
   */
  readonly elapsedTimeMs: number | null;
}

export type AnimationLoopCallback = (props: AnimationLoopCallbackProps) => void;

interface AnimationLoopOperator {
  start: () => void;
  stop: () => void;
}

export interface AnimationLoop {
  /**
   * 使用するコールバックを変更してアニメーションを開始する
   */
  set: (callback: AnimationLoopCallback) => void;
  /**
   * アニメーションを終了する
   */
  unset: () => void;
}

export function useAnimationLoop(): AnimationLoop {
  const refCallback = shallowRef<AnimationLoopCallback>();

  watchEffect((onCleanup) => {
    const callback = refCallback.value;
    if (callback == null) return;

    let requestedAnimationFrame: number;
    let startTimeMs: number | null = null;
    let lastTimeMs: number | null = null;
    let frame = 0;

    const animate: FrameRequestCallback = (timeMs) => {
      if (startTimeMs == null) {
        startTimeMs = timeMs;
      }

      callback({
        animationTimeMs: timeMs - startTimeMs,
        animationFrame: frame,
        elapsedTimeMs: lastTimeMs == null ? null : timeMs - lastTimeMs,
      });

      lastTimeMs = timeMs;
      ++frame;
      requestedAnimationFrame = requestAnimationFrame(animate);
    };

    const operator = {
      start: () => {
        requestedAnimationFrame = requestAnimationFrame(animate);
      },
      stop: () => {
        cancelAnimationFrame(requestedAnimationFrame);
      },
    };
    operator.start();

    onCleanup(() => {
      operator.stop();
    });
  });

  return {
    set: (callback) => {
      refCallback.value = callback;
    },
    unset: () => {
      refCallback.value = undefined;
    },
  };
}
