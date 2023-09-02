import { useMemo } from "react";

import type {
  DynamicFramesetGrid,
  DynamicFramesetTrackState,
  DynamicFramesetState,
} from "./DynamicFrameset.types";

/**
 * Iterate the cumulation of each track size between two adjacent lines.
 */
function* trackSteps(
  /**
   * List of line definitions
   */
  lines: readonly DynamicFramesetTrackState[],
): Iterable<number> {
  let lastStep = 0;

  yield lastStep;

  for (const { basis, flex } of lines) {
    const size = basis + flex;
    lastStep += size;
    yield lastStep;
  }
}

/**
 * Use the grid operations for a DynamicFrameset.
 */
export function useDynamicFramesetGrid<
  FrameProps,
  StaticProps extends Partial<FrameProps>,
>(
  /**
   * DynamicFrameset state
   */
  state: DynamicFramesetState<FrameProps, StaticProps>,
): DynamicFramesetGrid {
  const { rowTracks: rows, columnTracks: columns } = state;

  return useMemo<DynamicFramesetGrid>(() => {
    const rowSteps = [...trackSteps(rows)];
    const columnSteps = [...trackSteps(columns)];
    const lastRow = rowSteps.length - 1;
    const lastColumn = columnSteps.length - 1;

    function clampRow(row: number) {
      return Math.max(0, Math.min(row, lastRow));
    }

    function clampColumn(column: number) {
      return Math.max(0, Math.min(column, lastColumn));
    }

    return {
      getTotalSizes() {
        return {
          totalRowSize: rowSteps[lastRow] ?? 0,
          totalColumnSize: columnSteps[lastColumn] ?? 0,
        };
      },
      getAreaRect(gridArea: {
        readonly gridRowStart: number;
        readonly gridRowEnd: number;
        readonly gridColumnStart: number;
        readonly gridColumnEnd: number;
      }) {
        const rowStart = clampRow(gridArea.gridRowStart);
        const rowEnd = clampRow(gridArea.gridRowEnd);
        const columnStart = clampColumn(gridArea.gridColumnStart);
        const columnEnd = clampColumn(gridArea.gridColumnEnd);

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
  }, [rows, columns]);
}
