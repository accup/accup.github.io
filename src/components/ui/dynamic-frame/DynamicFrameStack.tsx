import { ResizableStack } from "../resizable-stack/ResizableStack";
import type {
  DynamicFrameMap,
  DynamicFrameMetricsChangedCallback,
  DynamicFrameStackState,
} from "./DynamicFrameset";
import { useMemo } from "react";

export function DynamicFrameStack({
  state,
  frameMap,
  barSize,
  indices,
  minRowSize,
  maxRowSize,
  minColumnSize,
  maxColumnSize,
  onMetricsChanged,
}: {
  state: DynamicFrameStackState;
  frameMap: DynamicFrameMap;
  barSize: number;
  indices: number[];
  minRowSize?: number | undefined;
  maxRowSize?: number | undefined;
  minColumnSize?: number | undefined;
  maxColumnSize?: number | undefined;
  onMetricsChanged?: DynamicFrameMetricsChangedCallback;
}) {
  const children = useMemo(() => {
    return state.entries.map();
  }, [state, state.entries, frameMap]);

  return (
    <ResizableStack direction={state.direction} barSize={barSize}>
      {}
    </ResizableStack>
  );
}
