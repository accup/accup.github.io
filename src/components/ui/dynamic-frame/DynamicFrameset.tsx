import {
  ResizableStack,
  type ResizableStackItem,
} from "../resizable-stack/ResizableStack";
import { useState, type ReactNode, useEffect, useMemo } from "react";

export type DynamicFrame = {
  key: string;
  children: (() => ReactNode) | undefined;
};
type DynamicFrameMap = Map<string, DynamicFrame>;

export type DynamicFrameState = {
  key: string;
  size: number;
};

export type DynamicFrameStackDirection = "row" | "column";
export type DynamicFrameStackState = {
  direction: DynamicFrameStackDirection;
  entries: DynamicFrameEntryState[];
};

export type DynamicFrameEntryState =
  | {
      type: "frame";
      frame: DynamicFrameState;
    }
  | {
      type: "stack";
      stack: DynamicFrameStackState;
    };

export type DynamicFramesetState = {
  root: DynamicFrameStackState;
};

export type DynamicFramesetOnFramesetStateRequested =
  () => DynamicFramesetState;
export type DynamicFramesetOnFramesetStateChanged = (
  state: DynamicFramesetState
) => void;
export type DynamicFramesetOnFrameRequested = (key: string) => () => ReactNode;

function cloneEntryState(
  entry: DynamicFrameEntryState
): DynamicFrameEntryState {
  switch (entry.type) {
    case "frame":
      return {
        type: "frame",
        frame: { ...entry.frame },
      };

    case "stack":
      return {
        type: "stack",
        stack: {
          direction: entry.stack.direction,
          entries: entry.stack.entries.map((entry) => cloneEntryState(entry)),
        },
      };
  }
}

function cloneStackState(
  stack: DynamicFrameStackState
): DynamicFrameStackState {
  return {
    direction: stack.direction,
    entries: stack.entries.map(cloneEntryState),
  };
}

type WalkOptions = {
  onFrameVisited?: ((frame: DynamicFrameState) => void) | undefined;
  onStackVisited?: ((stack: DynamicFrameStackState) => void) | undefined;
};

function walkEntryState(
  entry: DynamicFrameEntryState,
  options: WalkOptions
): void {
  const { onFrameVisited } = options;

  switch (entry.type) {
    case "frame":
      onFrameVisited?.(entry.frame);
      break;

    case "stack":
      walkStackState(entry.stack, options);
      break;
  }
}

function walkStackState(
  stack: DynamicFrameStackState,
  options: WalkOptions
): void {
  const { onStackVisited } = options;

  onStackVisited?.(stack);
  stack.entries.forEach((entry) => walkEntryState(entry, options));
}

type MakeTreeOptions = {
  barSize: number;
  indices?: number[];
  flow?: DynamicFrameStackDirection;
  minRowSize?: number | undefined;
  maxRowSize?: number | undefined;
  minColumnSize?: number | undefined;
  maxColumnSize?: number | undefined;
};

type FrameEntryMetrics = {
  minRowSize: number | null;
  maxRowSize: number | null;
  minColumnSize: number | null;
  maxColumnSize: number | null;
};

type MakeAndMeasureResult<T> = {
  metrics: FrameEntryMetrics;
  item: T;
};

function getStackNode({
  stack,
  frameMap,
  options,
}: {
  stack: DynamicFrameStackState;
  frameMap: DynamicFrameMap;
  options: MakeTreeOptions;
}): () => ReactNode {
  const { item } = makeAndMeasureStackNode(stack, frameMap, options);
  return item;
}

function makeAndMeasureEntryTree(
  entry: DynamicFrameEntryState,
  frameMap: DynamicFrameMap,
  options: MakeTreeOptions
): MakeAndMeasureResult<ResizableStackItem> {
  const {
    indices = [],
    flow = "row",
    minRowSize,
    maxRowSize,
    minColumnSize,
    maxColumnSize,
  } = options;

  switch (entry.type) {
    case "frame": {
      return {
        metrics: {
          minRowSize: minRowSize ?? null,
          maxRowSize: maxRowSize ?? null,
          minColumnSize: minColumnSize ?? null,
          maxColumnSize: maxColumnSize ?? null,
        },
        item: {
          key: `frame:${entry.frame.key}`,
          children:
            frameMap.get(entry.frame.key)?.children ?? (() => undefined),
          initialSize: entry.frame.size,
          minSize: flow === "row" ? minRowSize : minColumnSize,
          maxSize: flow === "row" ? maxRowSize : maxColumnSize,
        },
      };
    }

    case "stack": {
      const { metrics, item } = makeAndMeasureStackNode(
        entry.stack,
        frameMap,
        options
      );
      const { minRowSize, maxRowSize, minColumnSize, maxColumnSize } = metrics;

      const minSize = flow === "row" ? minRowSize : minColumnSize;
      const maxSize = flow === "row" ? maxRowSize : maxColumnSize;

      return {
        metrics,
        item: {
          key: `stack:${indices.join("-")}`,
          initialSize: maxSize ?? minSize ?? 0,
          minSize: minSize ?? undefined,
          maxSize: maxSize ?? undefined,
          children: item,
        },
      };
    }
  }
}

function makeAndMeasureStackNode(
  stack: DynamicFrameStackState,
  frameMap: DynamicFrameMap,
  options: MakeTreeOptions
): MakeAndMeasureResult<() => ReactNode> {
  const { indices = [], barSize } = options;

  const children = stack.entries.map((child, index) => {
    indices.push(index);
    const item = makeAndMeasureEntryTree(child, frameMap, {
      ...options,
      indices,
      flow: stack.direction,
    });
    indices.pop();
    return item;
  });

  const metrics = children.reduce<FrameEntryMetrics>(
    (
      {
        minRowSize: subMinRowSize,
        maxRowSize: subMaxRowSize,
        minColumnSize: subMinColumnSize,
        maxColumnSize: subMaxColumnSize,
      },
      { metrics: { minRowSize, maxRowSize, minColumnSize, maxColumnSize } }
    ) => {
      if (subMinRowSize == null) {
        subMinRowSize = minRowSize;
      } else {
        subMinRowSize += minRowSize ?? 0;
      }

      if (subMaxRowSize != null) {
        if (maxRowSize == null) {
          subMaxRowSize = null;
        } else {
          subMaxRowSize += maxRowSize;
        }
      }

      if (subMinColumnSize == null) {
        subMinColumnSize = minColumnSize;
      } else {
        subMinColumnSize += minColumnSize ?? 0;
      }

      if (subMaxColumnSize != null) {
        if (maxColumnSize == null) {
          subMaxColumnSize = null;
        } else {
          subMaxColumnSize += maxColumnSize;
        }
      }

      return {
        minRowSize: subMinRowSize,
        maxRowSize: subMaxRowSize,
        minColumnSize: subMinColumnSize,
        maxColumnSize: subMaxColumnSize,
      };
    },
    {
      minRowSize: null,
      maxRowSize: null,
      minColumnSize: null,
      maxColumnSize: null,
    }
  );

  const totalBarSize = barSize * children.length - 1;

  switch (stack.direction) {
    case "row":
      metrics.minRowSize ??= 0;
      metrics.minRowSize += totalBarSize;

      if (metrics.maxRowSize != null) {
        metrics.maxRowSize += totalBarSize;
      }
      break;

    case "column":
      metrics.minColumnSize ??= 0;
      metrics.minColumnSize += totalBarSize;

      if (metrics.maxColumnSize != null) {
        metrics.maxColumnSize += totalBarSize;
      }
      break;
  }

  return {
    metrics,
    item: () => (
      <ResizableStack direction={stack.direction} barSize={barSize}>
        {children.map(({ item }) => item)}
      </ResizableStack>
    ),
  };
}

export const DynamicFrameset = ({
  minRowSize,
  maxRowSize,
  minColumnSize,
  maxColumnSize,
  initialFramesetState,
  onFrameRequested,
  OnFramesetStateChanged,
}: {
  minRowSize?: number | undefined;
  maxRowSize?: number | undefined;
  minColumnSize?: number | undefined;
  maxColumnSize?: number | undefined;
  initialFramesetState?: DynamicFramesetState;
  onFrameRequested?: DynamicFramesetOnFrameRequested;
  OnFramesetStateChanged?: DynamicFramesetOnFramesetStateChanged;
}) => {
  const [framesetState, setFramesetState] = useState<DynamicFramesetState>();
  const [frameMap, setFrameMap] = useState<DynamicFrameMap>(() => new Map());

  useEffect(() => {
    if (initialFramesetState == null) {
      setFramesetState({
        root: {
          direction: "row",
          entries: [],
        },
      });
    } else {
      setFrameMap((prevValue) => {
        const newValue = new Map(prevValue);
        walkStackState(initialFramesetState.root, {
          onFrameVisited: (frame) => {
            if (newValue.has(frame.key)) return;

            newValue.set(frame.key, {
              key: frame.key,
              children: onFrameRequested?.(frame.key),
            });
          },
        });
        return newValue;
      });

      setFramesetState({
        root: cloneStackState(initialFramesetState.root),
      });
    }
  }, [initialFramesetState, onFrameRequested, setFrameMap, setFramesetState]);

  const StackNode = useMemo(
    () =>
      getStackNode({
        stack: framesetState?.root ?? {
          direction: "row",
          entries: [],
        },
        frameMap,
        options: {
          barSize: 6,
          minRowSize,
          maxRowSize,
          minColumnSize,
          maxColumnSize,
        },
      }),
    [
      framesetState,
      frameMap,
      minRowSize,
      maxRowSize,
      minColumnSize,
      maxColumnSize,
    ]
  );

  return <StackNode />;
};
