import { type ComponentProps, useCallback } from "react";

import {
  DynamicFrameset,
  type DynamicFramesetFlow,
  useDynamicFramesetReducer,
} from "../../ui/dynamic-frameset";

import * as classes from "./WavePresentation.css";

interface SomeComponentProps {
  readonly state: {
    readonly id: string;
    readonly flow: DynamicFramesetFlow;
  };
  setFlow: (flow: DynamicFramesetFlow) => void;
  setFrameState: (id: string, state: SomeComponentProps["state"]) => void;
  changeGridArea: (id: string) => void;
}

function SomeComponent({ state, setFlow, changeGridArea }: SomeComponentProps) {
  const { id, flow } = state;

  const handleClick = useCallback(() => {
    setFlow(flow);
    changeGridArea(id);
  }, [id, flow, setFlow, changeGridArea]);

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
        { basis: 100, flex: 0 },
        { basis: 100, flex: 0 },
        { basis: 100, flex: 0 },
        { basis: 100, flex: 0 },
        { basis: 100, flex: 0 },
        { basis: 100, flex: 0 },
        { basis: 100, flex: 0 },
        { basis: 100, flex: 0 },
        { basis: 100, flex: 0 },
      ],
      columns: [
        { basis: 100, flex: 0 },
        { basis: 100, flex: 0 },
        { basis: 100, flex: 0 },
        { basis: 100, flex: 0 },
        { basis: 100, flex: 0 },
        { basis: 100, flex: 0 },
        { basis: 100, flex: 0 },
        { basis: 100, flex: 0 },
        { basis: 100, flex: 0 },
        { basis: 100, flex: 0 },
        { basis: 100, flex: 0 },
        { basis: 100, flex: 0 },
        { basis: 100, flex: 0 },
        { basis: 100, flex: 0 },
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

  const handleChangeGridArea = useCallback(
    (id: string) => {
      const rows = dynamicFramesetState.rows.length;
      const columns = dynamicFramesetState.columns.length;
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
        ] satisfies readonly DynamicFramesetFlow[]
      ).map((id) => {
        const row = Math.floor(Math.random() * rows);
        const column = Math.floor(Math.random() * columns);
        const rowEnd = row + Math.floor(Math.random() * (rows - row)) + 1;
        const columnEnd =
          column + Math.floor(Math.random() * (columns - column)) + 1;

        dynamicFramesetStateActions.setFrameGrid(
          id,
          row,
          column,
          rowEnd,
          columnEnd,
        );
      });
    },
    [dynamicFramesetState, dynamicFramesetStateActions],
  );

  return (
    <div className={classes.root}>
      <DynamicFrameset
        state={dynamicFramesetState}
        FrameComponent={SomeComponent}
        FrameComponentProps={{
          setFlow: dynamicFramesetStateActions.changeFlow,
          setFrameState: dynamicFramesetStateActions.setFrameState,
          changeGridArea: handleChangeGridArea,
        }}
        classes={{
          frame: classes.frame,
        }}
      />
    </div>
  );
}
