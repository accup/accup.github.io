import { useCallback, useMemo } from "react";

import type {
  DynamicFramesetTrackState,
  DynamicFramesetTracksKit,
} from "./useDynamicFramesetTracksKit";

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

export interface DynamicFramesetGridRect {
  readonly rowSize: number;
  readonly columnSize: number;
  readonly insetRowStart: number;
  readonly insetRowEnd: number;
  readonly insetColumnStart: number;
  readonly insetColumnEnd: number;
}

export interface UseDynamicFramesetGridKitProps {
  readonly rowSideTracksKit: DynamicFramesetTracksKit;
  readonly columnSideTracksKit: DynamicFramesetTracksKit;
}

export interface DynamicFramesetGridKit {
  /**
   * Total size of all row tracks
   */
  readonly rowSideSize: number;
  /**
   * Total size of all column tracks
   */
  readonly columnSideSize: number;

  /**
   * Get the properties related to the size and position of a single grid track.
   */
  getAreaRect(gridArea: DynamicFramesetGridArea): DynamicFramesetGridRect;
}

/**
 * Use the grid operations for a DynamicFrameset.
 */
export function useDynamicFramesetGrid(
  props: UseDynamicFramesetGridKitProps,
): DynamicFramesetGridKit {
  const { rowSideTracksKit: rowTracks, columnSideTracksKit: columnTracks } =
    props;

  const rowSteps = useMemo(() => steps(rowTracks.tracks), [rowTracks]);
  const columnSteps = useMemo(() => steps(columnTracks.tracks), [columnTracks]);
  const lastRowLine = useMemo(() => rowSteps.length - 1, [rowSteps]);
  const lastColumnLine = useMemo(() => columnSteps.length - 1, [columnSteps]);

  const totalRowSize = useMemo(
    () => rowSteps[lastRowLine] ?? 0,
    [rowSteps, lastRowLine],
  );
  const totalColumnSize = useMemo(
    () => columnSteps[lastColumnLine] ?? 0,
    [columnSteps, lastColumnLine],
  );

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
    rowSideSize: totalRowSize,
    columnSideSize: totalColumnSize,
    getAreaRect,
  };
}

/**
 * Get cumulation of each track size between two adjacent lines.
 */
function steps(
  /**
   * List of line definitions
   */
  lines: readonly DynamicFramesetTrackState[],
): readonly number[] {
  let lastStep = 0;
  const steps = [lastStep];

  for (const { basis, flex } of lines) {
    const size = basis + flex;
    lastStep += size;
    steps.push(lastStep);
  }

  return steps;
}
