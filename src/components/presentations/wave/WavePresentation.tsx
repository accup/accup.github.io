import { useMemo } from "react";
import {
  DynamicFrameset,
  useDynamicFramesetKit,
} from "../../ui/dynamic-frameset";

import * as classes from "./WavePresentation.css";

interface SomeComponentProps {
  readonly label: string;
  onClick?(this: void): void;
}

function SomeComponent(props: SomeComponentProps) {
  const { label, onClick } = props;

  return (
    <button
      type="button"
      style={{
        padding: 0,
        fontSize: 1,
        color: "inherit",
        display: "block",
        background: "none",
        blockSize: "100%",
        inlineSize: "100%",
      }}
      onClick={onClick}
    >
      {label}
    </button>
  );
}

export function WavePresentation() {
  const frameset = useDynamicFramesetKit({
    initialize: () => ({
      rowTracks: Array.from({ length: 100 }, () => ({ basis: 24, flex: 0 })),
      columnTracks: Array.from({ length: 100 }, () => ({ basis: 24, flex: 0 })),
      frames: Array.from({ length: 1600 }, (_, index) => ({
        id: index.toString(10),
        gridArea: {
          gridRowStart: index % 40,
          gridRowEnd: (index % 40) + 1,
          gridColumnStart: Math.floor(index / 40),
          gridColumnEnd: Math.floor(index / 40) + 1,
        },
        constraints: {},
      })),
    }),
  });

  const {
    frames: { replaceFrames },
    rowTracks: { setState: setRowTracks },
    columnTracks: { setState: setColumnTracks },
  } = frameset;

  const framePropsMap = useMemo(() => {
    return new Map(
      Array.from({ length: 1600 }, (_, index) => [
        index.toString(10),
        {
          label: index.toString(10),
          onClick: () => {
            replaceFrames(
              Array.from({ length: 1600 }, () =>
                Math.floor(Math.random() * 1600),
              ).map((loc, index) => ({
                id: index.toString(10),
                gridArea: {
                  gridRowStart: loc % 40,
                  gridRowEnd: (loc % 40) + 1,
                  gridColumnStart: Math.floor(loc / 40),
                  gridColumnEnd: Math.floor(loc / 40) + 1,
                },
                constraints: {},
              })),
            );
          },
        } satisfies SomeComponentProps,
      ]),
    );
  }, [replaceFrames]);

  return (
    <div className={classes.root}>
      <DynamicFrameset
        frameset={frameset}
        framePropsMap={framePropsMap}
        classes={{ frameContainer: classes.frameContainer }}
        slots={{ Frame: SomeComponent }}
      />
    </div>
  );
}
