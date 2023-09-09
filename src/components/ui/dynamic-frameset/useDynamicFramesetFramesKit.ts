import { useCallback } from "react";
import { type InitializeState } from "../../../utils/react/state";
import { useConvertMap } from "../../../utils/react/useConvertMap";
import { useMapStateKit } from "../../../utils/react/useMapStateKit";
import type { DynamicFramesetFrameKey } from "./DynamicFrameset.types";
import type {
  DynamicFramesetGridArea,
  DynamicFramesetGridAreaConstraints,
} from "./useDynamicFramesetGridKit";

/**
 * DynamicFrameset Frame state
 */
export interface DynamicFramesetFrameState {
  /**
   * Position and size of the frame
   */
  readonly gridArea: DynamicFramesetGridArea;
  /**
   * Constraints of the frame grid area
   */
  readonly constraints: DynamicFramesetGridAreaConstraints;
}

export interface DynamicFramesetFrameKit<
  K extends DynamicFramesetFrameKey,
  TFrameProps,
> {
  readonly key: K;
  readonly frame: DynamicFramesetFrameState;
  readonly frameProps: TFrameProps | undefined;
  replaceFrame(frame: DynamicFramesetFrameState): void;
}

export interface UseDynamicFramesetFramesProps<
  K extends DynamicFramesetFrameKey,
> {
  initialize?:
    | InitializeState<ReadonlyMap<K, DynamicFramesetFrameState>>
    | undefined;
}

export interface DynamicFramesetFramesKit<K extends DynamicFramesetFrameKey> {
  /**
   * Mapping of frame states
   */
  readonly frameMap: ReadonlyMap<K, DynamicFramesetFrameState>;
  replaceFrameMap(frameMap: ReadonlyMap<K, DynamicFramesetFrameState>): void;
  setFrame(key: K, frame: DynamicFramesetFrameState): void;
  removeFrame(key: K): void;
  useFrameKits<TFrameProps>(
    framePropsMap: ReadonlyMap<K, TFrameProps>,
  ): readonly DynamicFramesetFrameKit<K, TFrameProps>[];
}

export function useDynamicFramesetFramesKit<K extends DynamicFramesetFrameKey>(
  props: UseDynamicFramesetFramesProps<K>,
): DynamicFramesetFramesKit<K> {
  const { initialize } = props;

  const {
    map: frameMap,
    replaceMap: replaceFrameMap,
    setItem: setFrame,
    removeItem: removeFrame,
  } = useMapStateKit<K, DynamicFramesetFrameState>({ initialize });

  const useFrameKits = useCallback(
    function useFrameKits<TFrameProps>(
      framePropsMap: ReadonlyMap<K, TFrameProps>,
    ): readonly DynamicFramesetFrameKit<K, TFrameProps>[] {
      const convert = useCallback(
        (key: K, frame: DynamicFramesetFrameState) => ({
          key,
          frame,
          frameProps: framePropsMap.get(key),
          replaceFrame: (frame: DynamicFramesetFrameState) => {
            setFrame(key, frame);
          },
        }),
        [framePropsMap],
      );

      const frameKitMap = useConvertMap<
        K,
        DynamicFramesetFrameState,
        DynamicFramesetFrameKit<K, TFrameProps>
      >({
        map: frameMap,
        convert,
      });

      return [...frameKitMap.values()];
    },
    [frameMap, setFrame],
  );

  return {
    frameMap,
    replaceFrameMap,
    setFrame,
    removeFrame,
    useFrameKits,
  };
}
