import { useReducer } from "react";

import type {
  DynamicFramesetFlow,
  DynamicFramesetState,
} from "./DynamicFrameset.types";

type DynamicFramesetAction<Props> =
  | {
      type: "reset";
      state: DynamicFramesetState<Props>;
    }
  | {
      type: "change-flow";
      flow: DynamicFramesetFlow;
    }
  | {
      type: "resize-container";
      flowSize: number;
    }
  | {
      type: "move-resize-bar";
      identifier: string;
    };

export function useDynamicFramesetReducer<RendererProps>(
  initializer?: (() => DynamicFramesetState<RendererProps>) | undefined
) {
  const initialState: DynamicFramesetState<RendererProps> = initializer?.() ?? {
    flow: "block-start/inline-start",
    rows: [],
    columns: [],
    frames: [],
  };

  return useReducer(
    (
      prevState: DynamicFramesetState<RendererProps>,
      action: DynamicFramesetAction<RendererProps>
    ) => {
      switch (action.type) {
        case "change-flow":
          return {
            ...prevState,
            flow: action.flow,
          };

        default:
          return prevState;
      }
    },
    initialState
  );
}
