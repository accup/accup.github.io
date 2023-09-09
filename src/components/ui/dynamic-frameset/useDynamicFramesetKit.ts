import {
  useInitialState,
  type InitializeState,
} from "../../../utils/react/state";
import type { DynamicFramesetOrigin } from "./DynamicFrameset.types";
import {
  useDynamicFramesetFramesKit,
  type DynamicFramesetFrameState,
  type DynamicFramesetFramesKit,
} from "./useDynamicFramesetFramesKit";
import {
  useDynamicFramesetGrid,
  type DynamicFramesetGridKit,
} from "./useDynamicFramesetGridKit";
import {
  useDynamicFramesetOriginKit,
  type DynamicFramesetOriginKit,
} from "./useDynamicFramesetOriginKit";
import {
  useDynamicFramesetTracksKit,
  type DynamicFramesetTrackState,
  type DynamicFramesetTracksKit,
} from "./useDynamicFramesetTracksKit";

export interface UseDynamicFramesetProps {
  readonly initialize?:
    | InitializeState<{
        readonly origin?: DynamicFramesetOrigin | undefined;
        readonly rowTracks?: readonly DynamicFramesetTrackState[] | undefined;
        readonly columnTracks?:
          | readonly DynamicFramesetTrackState[]
          | undefined;
        readonly frames?: readonly DynamicFramesetFrameState[] | undefined;
      }>
    | undefined;
}

export interface DynamicFramesetKit {
  readonly origin: DynamicFramesetOriginKit;
  readonly rowTracks: DynamicFramesetTracksKit;
  readonly columnTracks: DynamicFramesetTracksKit;
  readonly frames: DynamicFramesetFramesKit;
  readonly grid: DynamicFramesetGridKit;
}

export function useDynamicFramesetKit(
  props?: UseDynamicFramesetProps | undefined,
): DynamicFramesetKit {
  const { initialize } = props ?? {};

  const initialState = useInitialState(initialize);

  const origin = useDynamicFramesetOriginKit({
    initialize: initialState?.origin,
  });
  const rowTracks = useDynamicFramesetTracksKit({
    initialize: initialState?.rowTracks,
  });
  const columnTracks = useDynamicFramesetTracksKit({
    initialize: initialState?.columnTracks,
  });
  const frames = useDynamicFramesetFramesKit({
    initialize: initialState?.frames,
  });
  const grid = useDynamicFramesetGrid({ rowTracks, columnTracks });

  return {
    origin,
    rowTracks,
    columnTracks,
    frames,
    grid,
  };
}
