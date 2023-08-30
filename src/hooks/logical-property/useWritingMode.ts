import { type RefObject, useCallback, useRef, useState } from "react";

import {
  type AnimationLoopCallback,
  useAnimationLoop,
} from "../animation-frame/useAnimationLoop";

export type WritingModes = {
  writingMode: string;
  direction: string;
};

export function useWritingModes(ref: RefObject<HTMLElement>): WritingModes {
  const targetRef = useRef(ref.current);
  const computedStyleRef = useRef(
    getComputedStyle(ref.current ?? document.body),
  );

  const [writingMode, setWritingMode] = useState<string>(
    computedStyleRef.current.writingMode,
  );
  const [direction, setDirection] = useState<string>(
    computedStyleRef.current.direction,
  );

  const animationLoopCallback = useCallback<AnimationLoopCallback>(() => {
    if (targetRef.current !== ref.current) {
      targetRef.current = ref.current;
      computedStyleRef.current = getComputedStyle(
        targetRef.current ?? document.body,
      );
    }

    const computedStyle = computedStyleRef.current;
    setWritingMode(computedStyle.writingMode);
    setDirection(computedStyle.direction);
  }, [ref, targetRef, computedStyleRef, setWritingMode, setDirection]);

  useAnimationLoop(animationLoopCallback);

  return { writingMode, direction };
}
