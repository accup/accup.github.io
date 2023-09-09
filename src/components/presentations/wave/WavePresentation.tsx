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
        fontSize: 10,
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
  const framesetKit = useDynamicFramesetKit({
    initialize: () => ({
      rowSideTracks: Array.from({ length: 50 }, () => ({
        basis: 18,
        flex: 0,
      })),
      columnSideTracks: Array.from({ length: 120 }, () => ({
        basis: 18,
        flex: 0,
      })),
      frames: new Map(
        Array.from({ length: 500 }, (_, index) => [
          index.toString(10),
          {
            gridArea: {
              gridRowStart: index % 50,
              gridRowEnd: (index % 50) + 1,
              gridColumnStart: Math.floor(index / 50),
              gridColumnEnd: Math.floor(index / 50) + 1,
            },
            constraints: {},
          },
        ]),
      ),
    }),
  });

  const { replaceFrameMap } = framesetKit;

  const framePropsMap = useMemo(() => {
    return new Map(
      Array.from({ length: 800 }, (_, index) => [
        index.toString(10),
        {
          label: index.toString(10),
          onClick: () => {
            replaceFrameMap(
              new Map(
                Array.from({ length: Math.random() * 800 }, () =>
                  Math.floor(Math.random() * 5200),
                ).map((loc, index) => [
                  index.toString(10),
                  {
                    gridArea: {
                      gridRowStart: loc % 50,
                      gridColumnStart: Math.floor(loc / 50),
                      gridRowEnd:
                        (loc % 50) + Math.floor(Math.random() * 3) + 1,
                      gridColumnEnd:
                        Math.floor(loc / 50) +
                        Math.floor(Math.random() * 3) +
                        1,
                    },
                    constraints: {},
                  },
                ]),
              ),
            );
          },
        } satisfies SomeComponentProps,
      ]),
    );
  }, [replaceFrameMap]);

  return (
    <div className={classes.root}>
      <DynamicFrameset
        framesetKit={framesetKit}
        framePropsMap={framePropsMap}
        classes={{ frameContainer: classes.frameContainer }}
        slots={{ Frame: SomeComponent }}
      />
    </div>
  );
}
