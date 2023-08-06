import { useMemo, useState } from "react";

import type {
  DynamicFramesetFlow,
  DynamicFramesetFrameComponentProps,
  DynamicFramesetFrameState,
  DynamicFramesetState,
} from "./DynamicFrameset.types";

export function useDynamicFramesetReducer<
  TComponentProps extends DynamicFramesetFrameComponentProps
>(initializer?: (() => DynamicFramesetState<TComponentProps>) | undefined) {
  const [state, setState] = useState<DynamicFramesetState<TComponentProps>>(
    () =>
      initializer?.() ?? {
        flow: "block-start/inline-start",
        rows: [],
        columns: [],
        frames: [],
      }
  );

  const actions = useMemo(
    () => ({
      reset: (state: DynamicFramesetState<TComponentProps>) => {
        setState(state);
      },
      setFrameState: (
        id: string,
        frameState: DynamicFramesetFrameState<TComponentProps>["state"]
      ) => {
        setState((prevState) => ({
          ...prevState,
          frames: prevState.frames.map((frame) => {
            if (frame.id === id) {
              return {
                ...frame,
                state: frameState,
              };
            } else {
              return frame;
            }
          }),
        }));
      },
      changeFlow: (flow: DynamicFramesetFlow) => {
        setState((prevState) => ({ ...prevState, flow }));
      },
    }),
    [setState]
  );

  return [state, actions] as const;
}
