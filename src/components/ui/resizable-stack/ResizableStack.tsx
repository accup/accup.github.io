import { useWritingModes } from "../../../hooks/logical-property/useWritingMode";
import * as classes from "../resizable-stack/ResizableStack.css";
import { ResizableStackBar, ResizeDetails } from "./ResizableStackBar";
import classNames from "classnames";
import {
  type ReactNode,
  Fragment,
  useState,
  useEffect,
  useMemo,
  useRef,
  useCallback,
} from "react";

type ResizableStackDirection = "row" | "column";

export type ResizableStackItem = {
  key: string;
  initialSize: number;
  children: ReactNode;
};

type ChildState = ResizableStackItem & {
  /** determined space */
  size: number;
  /** free space */
  extraSize: number;
  /** undetermined space */
  pendingSize: number;
  /** resize bar */
  resizeBar?:
    | {
        onResizing: (details: ResizeDetails) => void;
        onResized: (details: ResizeDetails) => void;
      }
    | undefined;
};

export const ResizableStack = ({
  direction,
  children,
  barSize = 6,
}: {
  direction: ResizableStackDirection;
  children: readonly ResizableStackItem[];
  barSize?: number;
}) => {
  const rootRef = useRef<HTMLDivElement>(null);
  const writingModes = useWritingModes(rootRef);

  const initialStateMap = useMemo(() => new Map(), []);
  const stateMapRef = useRef<Map<string, ChildState>>(initialStateMap);
  const [stateList, setStateList] = useState<ChildState[]>([]);

  const createInitialState = useCallback(
    (child: ResizableStackItem): ChildState => {
      return {
        ...child,
        size: child.initialSize,
        extraSize: 0,
        pendingSize: child.initialSize,
      };
    },
    []
  );

  const updateStateList = useCallback(() => {
    const stateMap = stateMapRef.current;

    setStateList(
      children
        .map((child) => stateMap.get(child.key))
        .filter((state): state is ChildState => state != null)
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

  const mutateStateToResizePendingSize = useCallback(
    (details: ResizeDetails, prevKey: string, nextKey: string) => {
      mutateStateToDetermineExtraSize();

      const stateMap = stateMapRef.current;
      const prevState = stateMap.get(prevKey);
      const nextState = stateMap.get(nextKey);

      let { lengthwiseShift } = details;

      if (prevState != null) {
        lengthwiseShift = Math.max(lengthwiseShift, -prevState.size);
      }
      if (nextState != null) {
        lengthwiseShift = Math.min(lengthwiseShift, nextState.size);
      }

      if (prevState != null) {
        prevState.pendingSize = prevState.size + lengthwiseShift;
      }
      if (nextState != null) {
        nextState.pendingSize = nextState.size - lengthwiseShift;
      }
    },
    [stateMapRef]
  );

  const handleResizing = useCallback(
    (details: ResizeDetails, prevKey: string, nextKey: string) => {
      mutateStateToResizePendingSize(details, prevKey, nextKey);
      updateStateList();
    },
    [stateMapRef, updateStateList, mutateStateToResizePendingSize]
  );

  const handleResized = useCallback(
    (details: ResizeDetails, prevKey: string, nextKey: string) => {
      mutateStateToResizePendingSize(details, prevKey, nextKey);

      const stateMap = stateMapRef.current;
      const prevState = stateMap.get(prevKey);
      const nextState = stateMap.get(nextKey);

      if (prevState != null) {
        prevState.size = prevState.pendingSize;
      }
      if (nextState != null) {
        nextState.size = nextState.pendingSize;
      }

      updateStateList();
    },
    [stateMapRef, updateStateList, mutateStateToResizePendingSize]
  );

  useEffect(() => {
    const prevStateMap = stateMapRef.current;

    stateMapRef.current = new Map(
      children.map<[string, ChildState]>((child, index, self) => {
        const prevChild = self[index - 1];

        return [
          child.key,
          {
            ...(prevStateMap.get(child.key) ?? createInitialState(child)),
            resizeBar:
              prevChild == null
                ? undefined
                : {
                    onResizing: (details) => {
                      handleResizing(details, prevChild.key, child.key);
                    },
                    onResized: (details) => {
                      handleResized(details, prevChild.key, child.key);
                    },
                  },
          },
        ];
      })
    );

    updateStateList();
  }, [children, stateMapRef, updateStateList, handleResizing, handleResized]);

  const mutateStateToSpreadExtraSize = useCallback(
    (fullSize: number) => {
      const stateMap = stateMapRef.current;

      const states = [...stateMap.values()];

      const totalItemSize = states.reduce((sub, state) => sub + state.size, 0);
      const totalBarSize = barSize * Math.max(0, stateMap.size - 1);
      const totalSize = totalItemSize + totalBarSize;

      const freeSize = fullSize - totalSize;

      let subtotalItemSize = 0;
      states.forEach((state) => {
        const nextSubtotalItemSize = subtotalItemSize + state.size;

        const lower = Math.floor((freeSize * subtotalItemSize) / totalItemSize);
        const upper = Math.floor(
          (freeSize * nextSubtotalItemSize) / totalItemSize
        );

        subtotalItemSize = nextSubtotalItemSize;

        state.extraSize = upper - lower;
      });
    },
    [stateMapRef, barSize]
  );

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

      updateStateList();
    });
    observer.observe(rootRef.current);

    return () => {
      observer.disconnect();
    };
  }, [direction, rootRef, updateStateList, mutateStateToSpreadExtraSize]);

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
            <ResizableStackBar
              direction={direction}
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
            {child.children}
          </div>
        </Fragment>
      ))}
    </div>
  );
};
