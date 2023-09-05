import { useCallback, useMemo } from "react";

import type {
  DynamicFramesetTrack,
  DynamicFramesetTracksProps,
} from "./useDynamicFramesetTracks";

/**
 * Position and size of a frame
 */
export interface DynamicFramesetGridArea {
  /**
   * First row grid line
   */
  readonly gridRowStart: number;
  /**
   * First column grid line
   */
  readonly gridColumnStart: number;
  /**
   * Last row grid line
   */
  readonly gridRowEnd: number;
  /**
   * Last column grid line
   */
  readonly gridColumnEnd: number;
}

/**
 * Constraints of a frame grid area
 */
export interface DynamicFramesetGridAreaConstraints {
  /**
   * Inclusive lower limit of the row-side frame size
   */
  readonly minRowSize?: number | undefined;
  /**
   * Inclusive lower limit of the column-side frame size
   */
  readonly minColumnSize?: number | undefined;
  /**
   * Inclusive upper limit of the row-side frame size
   */
  readonly maxRowSize?: number | undefined;
  /**
   * Inclusive upper limit of the column-side frame size
   */
  readonly maxColumnSize?: number | undefined;
}

export interface UseDynamicFramesetGridProps {
  readonly rowTracks: DynamicFramesetTracksProps;
  readonly columnTracks: DynamicFramesetTracksProps;
}

/**
 * Grid properties for DynamicFrameset
 */
export interface DynamicFramesetGridProps {
  /**
   * Get the properties related to the total size of the grid tracks.
   */
  getTotalSizes(this: void): {
    /**
     * Total size of all row tracks.
     */
    readonly totalRowSize: number;
    /**
     * Total size of all column tracks.
     */
    readonly totalColumnSize: number;
  };

  /**
   * Get the properties related to the size and position of a single grid track.
   */
  getAreaRect(
    this: void,
    gridArea: DynamicFramesetGridArea,
  ): {
    readonly rowSize: number;
    readonly columnSize: number;
    readonly insetRowStart: number;
    readonly insetRowEnd: number;
    readonly insetColumnStart: number;
    readonly insetColumnEnd: number;
  };
}

/**
 * Use the grid operations for a DynamicFrameset.
 */
export function useDynamicFramesetGrid(
  props: UseDynamicFramesetGridProps,
): DynamicFramesetGridProps {
  const { rowTracks, columnTracks } = props;

  const rowSteps = useMemo(() => [...steps(rowTracks.tracks)], [rowTracks]);
  const columnSteps = useMemo(
    () => [...steps(columnTracks.tracks)],
    [columnTracks],
  );
  const lastRowLine = useMemo(() => rowSteps.length - 1, [rowSteps]);
  const lastColumnLine = useMemo(() => columnSteps.length - 1, [columnSteps]);

  const clampRowLine = useCallback(
    (rowTrack: number) => {
      return Math.max(0, Math.min(rowTrack, lastRowLine));
    },
    [lastRowLine],
  );
  const clampColumnLine = useCallback(
    (columnTrack: number) => {
      return Math.max(0, Math.min(columnTrack, lastColumnLine));
    },
    [lastColumnLine],
  );

  const getTotalSizes = useCallback(() => {
    return {
      totalRowSize: rowSteps[lastRowLine] ?? 0,
      totalColumnSize: columnSteps[lastColumnLine] ?? 0,
    };
  }, [rowSteps, columnSteps, lastRowLine, lastColumnLine]);

  const getAreaRect = useCallback(
    (gridArea: DynamicFramesetGridArea) => {
      const rowStart = clampRowLine(gridArea.gridRowStart);
      const rowEnd = clampRowLine(gridArea.gridRowEnd);
      const columnStart = clampColumnLine(gridArea.gridColumnStart);
      const columnEnd = clampColumnLine(gridArea.gridColumnEnd);

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
    [rowSteps, columnSteps, clampRowLine, clampColumnLine],
  );

  return {
    getTotalSizes,
    getAreaRect,
  };
}

/**
 * Iterate the cumulation of each track size between two adjacent lines.
 */
function* steps(
  /**
   * List of line definitions
   */
  lines: readonly DynamicFramesetTrack[],
): Iterable<number> {
  let lastStep = 0;

  yield lastStep;

  for (const { basis, flex } of lines) {
    const size = basis + flex;
    lastStep += size;
    yield lastStep;
  }
}
