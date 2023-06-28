import { useLogicalConverter } from "../../../hooks/logical-property/useLogicalConverter";
import type { WritingModes } from "../../../hooks/logical-property/useWritingMode";
import * as classes from "../resizable-stack/ResizableStackBar.css";
import classNames from "classnames";
import { PointerEvent, memo, useCallback, useMemo, useRef } from "react";

export type ResizableStackBarDirection = "row" | "column";
export type ResizableStackBarPosition =
  | "start"
  | "intermediate"
  | "end"
  | "both";

export type ResizeDetails = {
  lengthwiseShift: number;
  crosswiseShift: number;
};
type ResizingCallback = (details: ResizeDetails) => void;
type ResizedCallback = (details: ResizeDetails) => void;

export const ResizableStackBar = memo(
  ({
    direction,
    writingModes,
    size,
    position,
    onResizing,
    onResized,
  }: {
    direction: ResizableStackBarDirection;
    position: ResizableStackBarPosition;
    writingModes: WritingModes;
    size: number;
    onResizing?: ResizingCallback;
    onResized?: ResizedCallback;
  }) => {
    const logicalConvert = useLogicalConverter(writingModes);

    const getResizeDetails = useCallback(
      (record: {
        xStart: number;
        xEnd: number;
        yStart: number;
        yEnd: number;
      }): ResizeDetails => {
        const { xStart, xEnd, yStart, yEnd } = record;

        const { block, inline } = logicalConvert({
          x: { start: xStart, end: xEnd },
          y: { start: yStart, end: yEnd },
        });
        const { top, right, bottom, left } = logicalConvert({
          blockStart: block.start,
          blockEnd: block.end,
          inlineStart: inline.start,
          inlineEnd: inline.end,
        });
        const { block: blockShift, inline: inlineShift } = logicalConvert({
          x: right - left,
          y: bottom - top,
        });

        switch (direction) {
          case "row":
            return {
              lengthwiseShift: inlineShift,
              crosswiseShift: blockShift,
            };
          case "column":
            return {
              lengthwiseShift: blockShift,
              crosswiseShift: inlineShift,
            };
        }
      },
      [direction, logicalConvert]
    );

    const resizeStartStateRef = useRef<{
      pointerId: number;
      xStart: number;
      yStart: number;
    }>();

    const handleResizeStart = useCallback(
      (e: PointerEvent) => {
        if (!(e.target instanceof HTMLElement)) return;

        e.target.setPointerCapture(e.pointerId);

        resizeStartStateRef.current = {
          pointerId: e.pointerId,
          xStart: e.clientX,
          yStart: e.clientY,
        };

        const { xStart, yStart } = resizeStartStateRef.current;

        e.preventDefault();

        onResizing?.(
          getResizeDetails({
            xStart,
            xEnd: e.clientX,
            yStart,
            yEnd: e.clientY,
          })
        );
      },
      [resizeStartStateRef, onResizing, getResizeDetails]
    );

    const handleResize = useCallback(
      (e: PointerEvent) => {
        if (!(e.target instanceof HTMLElement)) return;
        if (resizeStartStateRef.current == null) return;

        const { pointerId, xStart, yStart } = resizeStartStateRef.current;

        if (e.pointerId !== pointerId) return;

        e.preventDefault();

        onResizing?.(
          getResizeDetails({
            xStart,
            xEnd: e.clientX,
            yStart,
            yEnd: e.clientY,
          })
        );
      },
      [resizeStartStateRef, onResizing, getResizeDetails]
    );

    const handleResizeEnd = useCallback(
      (e: PointerEvent) => {
        if (!(e.target instanceof HTMLElement)) return;
        if (resizeStartStateRef.current == null) return;

        const { pointerId, xStart, yStart } = resizeStartStateRef.current;
        if (e.pointerId !== pointerId) return;

        resizeStartStateRef.current = undefined;

        e.preventDefault();

        onResized?.(
          getResizeDetails({
            xStart,
            xEnd: e.clientX,
            yStart,
            yEnd: e.clientY,
          })
        );
      },
      [resizeStartStateRef, onResized, getResizeDetails]
    );

    const style = useMemo(() => {
      switch (direction) {
        case "row":
          return {
            inlineSize: size,
          };
        case "column":
          return {
            blockSize: size,
          };
      }
    }, [size, direction]);

    const classRootIs = useMemo(() => {
      const classRootIsDirection = logicalConvert({
        x: classes.rootIs.horizontal,
        y: classes.rootIs.vertical,
      });
      const classRootIsUniqueEnd = logicalConvert({
        top: classes.rootIs.verticalTopEnd,
        right: classes.rootIs.horizontalRightEnd,
        bottom: classes.rootIs.verticalBottomEnd,
        left: classes.rootIs.horizontalLeftEnd,
      });
      const classRootIsBothEnd = logicalConvert({
        x: classes.rootIs.horizontalBothEnd,
        y: classes.rootIs.verticalBothEnd,
      });

      switch (direction) {
        case "row":
          return classNames(classes.rootIs.row, classRootIsDirection.inline, {
            [classRootIsUniqueEnd.inlineStart]: position === "start",
            [classRootIsUniqueEnd.inlineEnd]: position === "end",
            [classRootIsBothEnd.inline]: position === "both",
          });
        case "column":
          return classNames(classes.rootIs.column, classRootIsDirection.block, {
            [classRootIsUniqueEnd.blockStart]: position === "start",
            [classRootIsUniqueEnd.blockEnd]: position === "end",
            [classRootIsBothEnd.block]: position === "both",
          });
      }
    }, [direction, position, logicalConvert]);

    return (
      <div
        className={classNames(classes.root, classRootIs)}
        style={style}
        onPointerDown={handleResizeStart}
        onPointerMove={handleResize}
        onPointerCancel={handleResizeEnd}
        onPointerUp={handleResizeEnd}
      />
    );
  }
);
