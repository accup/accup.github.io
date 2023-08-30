import { useWritingModes } from "../../../hooks/logical-property/useWritingMode";
import * as classes from "./ResizableStack.css";
import {
  ResizableStackBar,
  type ResizableStackBarPosition,
  type ResizeDetails,
} from "./ResizableStackBar";
import classNames from "classnames";
import {
  Fragment,
  useState,
  useEffect,
  useMemo,
  useRef,
  useCallback,
  type ReactNode,
  memo,
} from "react";

type ResizableStackDirection = "row" | "column";

export type ResizableStackItem = {
  /** identity */
  key: string;
  /** frame contents */
  children: () => ReactNode;
  /** initial determined space */
  initialSize: number;
  /** lower space constraint */
  minSize?: number | undefined;
  /** lower space constraint */
  maxSize?: number | undefined;
};

type ChildState = Omit<ResizableStackItem, "minSize"> & {
  /** determined space */
  size: number;
  /** lower space constraint */
  minSize: number;
  /** free space */
  extraSize: number;
  /** undetermined space */
  pendingSize: number;
  /** resize bar */
  resizeBar?:
    | {
        formerKey: string;
        position: ResizableStackBarPosition;
        onResizing: (details: ResizeDetails) => void;
        onResized: (details: ResizeDetails) => void;
      }
    | undefined;
};

const MemoResizableStackBar = memo(ResizableStackBar);

export function ResizableStack({
  direction,
  children,
  barSize = 6,
}: {
  direction: ResizableStackDirection;
  children: readonly ResizableStackItem[];
  barSize?: number | undefined;
}) {
  const rootRef = useRef<HTMLDivElement>(null);
  const writingModes = useWritingModes(rootRef);

  const initialStateMap = useMemo(() => new Map(), []);
  const stateMapRef = useRef<Map<string, ChildState>>(initialStateMap);
  const [stateList, setStateList] = useState<ChildState[]>([]);

  const createInitialState = useCallback(
    (child: ResizableStackItem): ChildState => {
      const minSize = child.minSize ?? 0;
      const initialSize = Math.max(child.initialSize, minSize);

      return {
        ...child,
        size: initialSize,
        minSize,
        extraSize: 0,
        pendingSize: initialSize,
      };
    },
    [],
  );

  const getBarPosition = useCallback(
    (
      formerState: ChildState,
      latterState: ChildState,
    ): ResizableStackBarPosition => {
      const formerMinSize = formerState.minSize;
      const formerMaxSize = formerState.maxSize;
      const latterMinSize = latterState.minSize;
      const latterMaxSize = latterState.maxSize;

      const isFormerSmallest =
        formerState.pendingSize + formerState.extraSize <= formerMinSize;
      const isFormerLargest =
        formerMaxSize != null &&
        formerState.pendingSize + formerState.extraSize >= formerMaxSize;
      const isLatterSmallest =
        latterState.pendingSize + latterState.extraSize <= latterMinSize;
      const isLatterLargest =
        latterMaxSize != null &&
        latterState.pendingSize + latterState.extraSize >= latterMaxSize;

      const isStart = isFormerSmallest || isLatterLargest;
      const isEnd = isFormerLargest || isLatterSmallest;

      if (isStart) {
        if (isEnd) {
          return "both";
        } else {
          return "start";
        }
      } else {
        if (isEnd) {
          return "end";
        } else {
          return "intermediate";
        }
      }
    },
    [],
  );

  const updateStateList = useCallback(() => {
    const stateMap = stateMapRef.current;

    setStateList(
      children
        .map((child) => stateMap.get(child.key))
        .filter((state): state is ChildState => state != null),
    );
  }, [children, stateMapRef]);

  const mutateStateToDetermineExtraSize = useCallback(() => {
    const stateMap = stateMapRef.current;

    stateMap.forEach((state) => {
      state.size = Math.max(0, state.size + state.extraSize);
      state.pendingSize = state.size;
      state.extraSize = 0;
    });
  }, [stateMapRef]);

  const mutateStateToUpdateBarPosition = useCallback(() => {
    const stateMap = stateMapRef.current;

    stateMap.forEach((state) => {
      if (state.resizeBar == null) return;

      const formerState = stateMap.get(state.resizeBar.formerKey);
      if (formerState == null) return;

      state.resizeBar.position = getBarPosition(formerState, state);
    });
  }, [stateMapRef, getBarPosition]);

  const mutateStateToResizePendingSize = useCallback(
    (details: ResizeDetails, formerKey: string, latterKey: string) => {
      const stateMap = stateMapRef.current;
      const formerState = stateMap.get(formerKey);
      const latterState = stateMap.get(latterKey);

      let { lengthwiseShift } = details;

      if (formerState != null) {
        lengthwiseShift = Math.max(
          lengthwiseShift,
          -formerState.size,
          -(formerState.size - formerState.minSize),
        );

        if (formerState.maxSize != null) {
          lengthwiseShift = Math.min(
            lengthwiseShift,
            -(formerState.size - formerState.maxSize),
          );
        }
      }
      if (latterState != null) {
        lengthwiseShift = Math.min(
          lengthwiseShift,
          latterState.size,
          latterState.size - latterState.minSize,
        );

        if (latterState.maxSize != null) {
          lengthwiseShift = Math.max(
            lengthwiseShift,
            latterState.size - latterState.maxSize,
          );
        }
      }

      if (formerState != null) {
        formerState.pendingSize = formerState.size + lengthwiseShift;
      }
      if (latterState != null) {
        latterState.pendingSize = latterState.size - lengthwiseShift;
      }
    },
    [stateMapRef],
  );

  const mutateStateToFixSize = useCallback(
    (formerKey: string, latterKey: string) => {
      const stateMap = stateMapRef.current;
      const prevState = stateMap.get(formerKey);
      const nextState = stateMap.get(latterKey);

      if (prevState != null) {
        prevState.size = prevState.pendingSize;
      }
      if (nextState != null) {
        nextState.size = nextState.pendingSize;
      }
    },
    [stateMapRef],
  );

  const mutateStateToSpreadExtraSize = useCallback(
    (fullSize: number) => {
      const stateMap = stateMapRef.current;

      const totalBarSize = barSize * Math.max(0, stateMap.size - 1);

      let undeterminedStates = Array.from(stateMap.values());
      let undeterminedFullSize = fullSize - totalBarSize;

      const maxTrials = undeterminedStates.length;

      for (let trial = 0; trial < maxTrials; ++trial) {
        if (undeterminedStates.length <= 0) break;

        const totalItemSize = undeterminedStates.reduce(
          (sub, state) => sub + state.size,
          0,
        );

        const freeSize = undeterminedFullSize - totalItemSize;

        const remainingUndeterminedStates = undeterminedStates.filter(
          (state, index) => {
            const lower = Math.floor(
              (freeSize * index) / undeterminedStates.length,
            );
            const upper = Math.floor(
              (freeSize * (index + 1)) / undeterminedStates.length,
            );

            let isDetermined = false;

            const preferredExtraSize = upper - lower;
            let extraSize = preferredExtraSize;

            const minExtraSize = state.minSize - state.size;
            if (extraSize < minExtraSize) {
              extraSize = minExtraSize;
              isDetermined = true;
            }

            if (state.maxSize != null) {
              const maxExtraSize = state.maxSize - state.size;
              if (extraSize > maxExtraSize) {
                extraSize = maxExtraSize;
                isDetermined = true;
              }
            }

            state.extraSize = extraSize;

            if (isDetermined) {
              undeterminedFullSize -= state.size + extraSize;
            }

            const isUndetermined = !isDetermined;
            return isUndetermined;
          },
        );

        if (remainingUndeterminedStates.length === undeterminedStates.length)
          break;

        undeterminedStates = remainingUndeterminedStates;
      }
    },
    [stateMapRef, barSize],
  );

  const handleResizing = useCallback(
    (details: ResizeDetails, formerKey: string, latterKey: string) => {
      mutateStateToDetermineExtraSize();
      mutateStateToResizePendingSize(details, formerKey, latterKey);
      mutateStateToUpdateBarPosition();
      updateStateList();
    },
    [
      updateStateList,
      mutateStateToDetermineExtraSize,
      mutateStateToResizePendingSize,
      mutateStateToUpdateBarPosition,
    ],
  );

  const handleResized = useCallback(
    (details: ResizeDetails, formerKey: string, latterKey: string) => {
      mutateStateToDetermineExtraSize();
      mutateStateToResizePendingSize(details, formerKey, latterKey);
      mutateStateToFixSize(formerKey, latterKey);
      mutateStateToUpdateBarPosition();
      updateStateList();
    },
    [
      updateStateList,
      mutateStateToDetermineExtraSize,
      mutateStateToResizePendingSize,
      mutateStateToFixSize,
      mutateStateToUpdateBarPosition,
    ],
  );

  const mutateStateToReinitialize = useCallback(
    (children: readonly ResizableStackItem[]) => {
      const prevStateMap = stateMapRef.current;

      let formerSiblingState: ChildState | null = null;

      stateMapRef.current = new Map(
        children.map<[string, ChildState]>((child) => {
          const prevState =
            prevStateMap.get(child.key) ?? createInitialState(child);

          const formerState = formerSiblingState;
          const state: ChildState = {
            ...prevState,
            resizeBar:
              formerState == null
                ? undefined
                : {
                    formerKey: formerState.key,
                    position: getBarPosition(formerState, prevState),
                    onResizing: (details) => {
                      handleResizing(details, formerState.key, child.key);
                    },
                    onResized: (details) => {
                      handleResized(details, formerState.key, child.key);
                    },
                  },
          };

          formerSiblingState = state;

          return [child.key, state];
        }),
      );
    },
    [
      stateMapRef,
      getBarPosition,
      createInitialState,
      handleResizing,
      handleResized,
    ],
  );

  useEffect(() => {
    mutateStateToReinitialize(children);
    updateStateList();
  }, [children, updateStateList, mutateStateToReinitialize]);

  useEffect(() => {
    if (rootRef.current == null) return;

    const observer = new ResizeObserver((entries) => {
      entries.forEach((entry) => {
        const [size] = entry.contentBoxSize;
        if (size == null) return;

        switch (direction) {
          case "row":
            mutateStateToSpreadExtraSize(size.inlineSize);
            break;

          case "column":
            mutateStateToSpreadExtraSize(size.blockSize);
            break;
        }
      });

      mutateStateToUpdateBarPosition();
      updateStateList();
    });
    observer.observe(rootRef.current);

    return () => {
      observer.disconnect();
    };
  }, [
    direction,
    rootRef,
    updateStateList,
    mutateStateToSpreadExtraSize,
    mutateStateToUpdateBarPosition,
  ]);

  return (
    <div
      ref={rootRef}
      className={classNames(classes.root, {
        [classes.rootIs.row]: direction === "row",
        [classes.rootIs.column]: direction === "column",
      })}
    >
      {stateList?.map((child) => (
        <Fragment key={child.key}>
          {child.resizeBar != null && (
            <MemoResizableStackBar
              direction={direction}
              position={child.resizeBar.position}
              writingModes={writingModes}
              size={barSize}
              onResizing={child.resizeBar.onResizing}
              onResized={child.resizeBar.onResized}
            />
          )}
          <div
            className={classes.child}
            style={{
              blockSize:
                direction === "column"
                  ? child.pendingSize + child.extraSize
                  : undefined,
              inlineSize:
                direction === "row"
                  ? child.pendingSize + child.extraSize
                  : undefined,
            }}
          >
            {<child.children />}
          </div>
        </Fragment>
      ))}
    </div>
  );
}
