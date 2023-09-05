import type { DynamicFramesetFrameId } from "./DynamicFrameset.types";
import type {
  DynamicFramesetGridArea,
  DynamicFramesetGridAreaConstraints,
  DynamicFramesetGridProps,
} from "./useDynamicFramesetGrid";
import type { DynamicFramesetOriginProps } from "./useDynamicFramesetOrigin";
import { useArrayState, type UseStateProps } from "../../../utils/react/state";

/**
 * DynamicFrameset Frame
 */
export interface DynamicFramesetFrame {
  /**
   * Frame identifier
   */
  readonly id: DynamicFramesetFrameId;
  /**
   * Position and size of the frame
   */
  readonly gridArea: DynamicFramesetGridArea;
  /**
   * Constraints of the frame grid area
   */
  readonly constraints: DynamicFramesetGridAreaConstraints;
}

export interface UseDynamicFramesetFramesProps
  extends UseStateProps<readonly DynamicFramesetFrame[]> {
  readonly origin: DynamicFramesetOriginProps;
  readonly grid: DynamicFramesetGridProps;
}

export interface DynamicFramesetFramesProps {
  readonly frames: readonly DynamicFramesetFrame[];
  setFrames(frames: readonly DynamicFramesetFrame[]): void;
  insertFrame(index: number, frame: DynamicFramesetFrame): void;
  updateFrame(index: number, frame: DynamicFramesetFrame): void;
  removeFrame(index: number, frame: DynamicFramesetFrame): void;
}

export function useDynamicFramesetFrames(
  props: UseDynamicFramesetFramesProps,
): DynamicFramesetFramesProps {
  const { initialize = [] } = props;

  const {
    array: frames,
    setArray: setFrames,
    insertItem: insertFrame,
    updateItem: updateFrame,
    removeItem: removeFrame,
  } = useArrayState(initialize);

  return {
    frames,
    setFrames,
    insertFrame,
    updateFrame,
    removeFrame,
  };
}
