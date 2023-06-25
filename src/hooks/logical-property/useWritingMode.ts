import { RefCallback, useCallback, useMemo, useState } from "react";

import {
  AnimationLoopCallback,
  useAnimationLoop,
} from "../animation-frame/useAnimationLoop";

export type WritingModes = {
  writingMode: string;
  direction: string;
};

export function useWritingModes(): [RefCallback<HTMLElement>, WritingModes] {
  const [target, setTarget] = useState<HTMLElement | null>(null);
  const computedStyle = useMemo(
    () => getComputedStyle(target ?? document.body),
    [target]
  );

  const [writingMode, setWritingMode] = useState<string>(
    computedStyle.writingMode
  );
  const [direction, setDirection] = useState<string>(computedStyle.direction);

  const animationLoopCallback = useCallback<AnimationLoopCallback>(() => {
    setWritingMode(computedStyle.writingMode);
    setDirection(computedStyle.direction);
  }, [computedStyle, setWritingMode, setDirection]);

  useAnimationLoop(animationLoopCallback);

  const ref = useCallback(
    (instance: HTMLElement | null) => {
      setTarget(instance);
    },
    [setTarget]
  );

  return [ref, { writingMode, direction }];
}
