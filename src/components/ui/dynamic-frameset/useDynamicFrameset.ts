import {
  useDynamicFramesetFrames,
  type DynamicFramesetFramesProps,
  type UseDynamicFramesetFramesProps,
} from "./useDynamicFramesetFrames";
import {
  useDynamicFramesetGrid,
  type DynamicFramesetGridProps,
} from "./useDynamicFramesetGrid";
import {
  useDynamicFramesetOrigin,
  type DynamicFramesetOriginProps,
  type UseDynamicFramesetOriginProps,
} from "./useDynamicFramesetOrigin";
import {
  useDynamicFramesetTracks,
  type DynamicFramesetTracksProps,
  type UseDynamicFramesetTracksProps,
} from "./useDynamicFramesetTracks";

export interface UseDynamicFramesetProps {
  readonly origin: Pick<UseDynamicFramesetOriginProps, "initialize">;
  readonly rowTracks: Pick<UseDynamicFramesetTracksProps, "initialize">;
  readonly columnTracks: Pick<UseDynamicFramesetTracksProps, "initialize">;
  readonly frames: Pick<UseDynamicFramesetFramesProps, "initialize">;
}

export interface DynamicFramesetProps {
  readonly origin: DynamicFramesetOriginProps;
  readonly rowTracks: DynamicFramesetTracksProps;
  readonly columnTracks: DynamicFramesetTracksProps;
  readonly grid: DynamicFramesetGridProps;
  readonly frames: DynamicFramesetFramesProps;
}

export function useDynamicFrameset(props: UseDynamicFramesetProps) {
  const origin = useDynamicFramesetOrigin(props.origin);
  const rowTracks = useDynamicFramesetTracks(props.rowTracks);
  const columnTracks = useDynamicFramesetTracks(props.columnTracks);
  const grid = useDynamicFramesetGrid({
    rowTracks,
    columnTracks,
  });
  const frames = useDynamicFramesetFrames({
    ...props.frames,
    origin,
    grid,
  });

  return {
    origin,
    rowTracks,
    columnTracks,
    grid,
    frames,
  };
}
