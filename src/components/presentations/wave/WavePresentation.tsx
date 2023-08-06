import {
  DynamicFrameset,
  type DynamicFramesetFlow,
  useDynamicFramesetReducer,
} from "@accup/react-dynamic-frameset";
import { ComponentProps, useCallback } from "react";

import * as classes from "./WavePresentation.css";

interface SomeComponentProps {
  readonly state: {
    readonly id: string;
    readonly flow: DynamicFramesetFlow;
  };
  setFlow: (flow: DynamicFramesetFlow) => void;
  setFrameState: (id: string, state: SomeComponentProps["state"]) => void;
}

function SomeComponent({ state, setFlow, setFrameState }: SomeComponentProps) {
  const { id, flow } = state;

  const handleClick = useCallback(() => {
    setFlow(flow);
    setFrameState(id, {
      ...state,
      flow:
        (
          [
            "top/left",
            "top/right",
            "bottom/left",
            "bottom/right",
            "left/top",
            "left/bottom",
            "right/top",
            "right/bottom",
            "block-start/inline-start",
            "block-start/inline-end",
            "block-end/inline-start",
            "block-end/inline-end",
            "inline-start/block-start",
            "inline-start/block-end",
            "inline-end/block-start",
            "inline-end/block-end",
          ] as const
        )[Math.floor(Math.random() * 16)] ?? "block-end/inline-end",
    });
  }, [state, id, flow, setFlow, setFrameState]);

  return (
    <button
      type="button"
      style={{
        fontSize: 16,
        color: "inherit",
        display: "block",
        background: "none",
        blockSize: "100%",
        inlineSize: "100%",
      }}
      onClick={handleClick}
    >
      {flow}
    </button>
  );
}

export function WavePresentation() {
  const [dynamicFramesetState, dynamicFramesetStateActions] =
    useDynamicFramesetReducer<ComponentProps<typeof SomeComponent>>(() => ({
      flow: "block-start/inline-start",
      rows: [
        { basis: 70, flex: 0 },
        { basis: 80, flex: 0 },
        { basis: 90, flex: 0 },
        { basis: 100, flex: 0 },
        { basis: 110, flex: 0 },
        { basis: 120, flex: 0 },
        { basis: 130, flex: 0 },
        { basis: 140, flex: 0 },
      ],
      columns: [
        { basis: 100, flex: 0 },
        { basis: 200, flex: 0 },
        { basis: 400, flex: 0 },
      ],
      frames: (
        [
          "top/left",
          "top/right",
          "bottom/left",
          "bottom/right",
          "left/top",
          "left/bottom",
          "right/top",
          "right/bottom",
          "block-start/inline-start",
          "block-start/inline-end",
          "block-end/inline-start",
          "block-end/inline-end",
          "inline-start/block-start",
          "inline-start/block-end",
          "inline-end/block-start",
          "inline-end/block-end",
        ] satisfies readonly DynamicFramesetFlow[]
      ).map((flow, index) => ({
        id: flow,
        state: { id: flow, flow },
        gridRowStart: index % 8,
        gridRowEnd: (index % 8) + 1,
        gridColumnStart: Math.floor(index / 8),
        gridColumnEnd: Math.floor(index / 8) + 1,
      })),
    }));

  return (
    <div className={classes.root}>
      <DynamicFrameset
        state={dynamicFramesetState}
        FrameComponent={SomeComponent}
        FrameComponentProps={{
          setFlow: dynamicFramesetStateActions.changeFlow,
          setFrameState: dynamicFramesetStateActions.setFrameState,
        }}
      />
    </div>
  );
}
