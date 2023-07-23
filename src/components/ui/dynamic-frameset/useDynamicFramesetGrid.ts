import { useMemo } from "react";

import type {
  DynamicFramesetGrid,
  DynamicFramesetLineState,
  DynamicFramesetState,
} from "./DynamicFrameset.types";

function* lineSteps(
  lines: readonly DynamicFramesetLineState[]
): Iterable<number> {
  let lastStep = 0;

  yield lastStep;

  for (const { basis, flex } of lines) {
    const size = basis + flex;
    lastStep += size;
    yield lastStep;
  }
}

export function useDynamicFramesetGrid(
  state: DynamicFramesetState<unknown>
): DynamicFramesetGrid {
  return useMemo<DynamicFramesetGrid>(() => {
    const rowSteps = [...lineSteps(state.rows)];
    const columnSteps = [...lineSteps(state.columns)];
    const maxRow = rowSteps.length - 1;
    const maxColumn = columnSteps.length - 1;

    return {
      getFullSize: () => {
        return {
          fullRowSize: rowSteps[maxRow] ?? 0,
          fullColumnSize: columnSteps[maxColumn] ?? 0,
        };
      },
      getAreaRect: ({
        rowStart,
        rowEnd,
        columnStart,
        columnEnd,
      }: {
        readonly rowStart: number;
        readonly rowEnd: number;
        readonly columnStart: number;
        readonly columnEnd: number;
      }) => {
        rowStart = Math.max(0, Math.min(rowStart, maxRow));
        rowEnd = Math.max(0, Math.min(rowEnd, maxRow));
        columnStart = Math.max(0, Math.min(columnStart, maxColumn));
        columnEnd = Math.max(0, Math.min(columnEnd, maxColumn));

        const insetRowStart = rowSteps[rowStart] ?? 0;
        const insetRowEnd = rowSteps[rowEnd] ?? 0;
        const insetColumnStart = columnSteps[columnStart] ?? 0;
        const insetColumnEnd = columnSteps[columnEnd] ?? 0;

        return {
          rowSize: insetRowEnd - insetRowStart,
          columnSize: insetColumnEnd - insetColumnStart,
          insetRowStart,
          insetRowEnd,
          insetColumnStart,
          insetColumnEnd,
        };
      },
    };
  }, [state.rows, state.columns]);
}
