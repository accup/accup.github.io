import { useCallback, useMemo } from "react";

import type { WritingModes } from "./useWritingMode";

export type PhysicalPoint<T> = { x: T; y: T };
export type PhysicalRect<T> = { top: T; right: T; bottom: T; left: T };
export type LogicalPoint<T> = { block: T; inline: T };
export type LogicalRect<T> = {
  blockStart: T;
  blockEnd: T;
  inlineStart: T;
  inlineEnd: T;
};

type PhysicalPointKeyword = "x" | "y";
type LogicalPointKeyword = "block" | "inline";
type PhysicalRectKeyword = "top" | "right" | "bottom" | "left";
type LogicalRectKeyword =
  | "blockStart"
  | "blockEnd"
  | "inlineStart"
  | "inlineEnd";
type PhysicalKeyword = PhysicalPointKeyword | PhysicalRectKeyword;
type LogicalKeyword = LogicalPointKeyword | LogicalRectKeyword;
type ConvertibleKeyword = PhysicalKeyword | LogicalKeyword;

type ConvertibleRecord<T> = {
  readonly [K in PhysicalKeyword | LogicalKeyword]?: T;
};
type RecordConversion<
  TRecord extends ConvertibleRecord<unknown>,
  TConvertibleKeyword extends ConvertibleKeyword
> = TRecord extends Record<TConvertibleKeyword, unknown>
  ? {
      [K in LogicalConverterMap[keyof TRecord &
        TConvertibleKeyword]]: TRecord[keyof TRecord & TConvertibleKeyword];
    }
  : {
      [K in LogicalConverterMap[keyof TRecord &
        TConvertibleKeyword]]?: TRecord[keyof TRecord & TConvertibleKeyword];
    };

type LogicalConverterMap = {
  [K in PhysicalPointKeyword]: LogicalPointKeyword;
} & {
  [K in LogicalPointKeyword]: PhysicalPointKeyword;
} & {
  [K in PhysicalRectKeyword]: LogicalRectKeyword;
} & {
  [K in LogicalRectKeyword]: PhysicalRectKeyword;
};

type ConvertedRecord<TRecord extends ConvertibleRecord<unknown>> = Omit<
  TRecord,
  ConvertibleKeyword
> &
  RecordConversion<TRecord, PhysicalPointKeyword> &
  RecordConversion<TRecord, LogicalPointKeyword> &
  RecordConversion<TRecord, PhysicalRectKeyword> &
  RecordConversion<TRecord, LogicalRectKeyword>;

export type LogicalConverter = <TRecord extends ConvertibleRecord<unknown>>(
  record: TRecord
) => ConvertedRecord<TRecord>;

export function useLogicalConverter(
  writingModes: Readonly<WritingModes>
): LogicalConverter {
  const logicalConverterMap = useMemo<LogicalConverterMap>(() => {
    const map: LogicalConverterMap = {
      block: "y",
      inline: "x",
      x: "inline",
      y: "block",
      blockStart: "top",
      blockEnd: "bottom",
      inlineStart: "left",
      inlineEnd: "right",
      top: "blockStart",
      right: "inlineEnd",
      bottom: "blockEnd",
      left: "inlineStart",
    };

    // change block
    switch (writingModes.writingMode) {
      case "vertical-rl":
      case "sideways-rl":
      case "tb":
      case "tb-rl":
        map.block = "x";
        map.x = "block";
        map.blockStart = "right";
        map.blockEnd = "left";
        map.right = "blockStart";
        map.left = "blockEnd";
        break;

      case "vertical-lr":
      case "sideways-lr":
      case "tb-lr":
        map.block = "x";
        map.x = "block";
        map.blockStart = "left";
        map.blockEnd = "right";
        map.right = "blockEnd";
        map.left = "blockStart";
        break;
    }

    // change inline
    switch (writingModes.writingMode) {
      case "vertical-rl":
      case "vertical-lr":
      case "tb":
      case "tb-rl":
      case "tb-lr":
        map.inline = "y";
        map.y = "inline";
        map.inlineStart = "top";
        map.inlineEnd = "bottom";
        map.top = "inlineStart";
        map.bottom = "inlineEnd";
        break;

      case "sideways-rl":
      case "sideways-lr":
        map.inline = "y";
        map.y = "inline";
        map.inlineStart = "bottom";
        map.inlineEnd = "top";
        map.top = "inlineEnd";
        map.bottom = "inlineStart";
        break;

      case "rl":
        map.inlineStart = "right";
        map.inlineEnd = "left";
        map.right = "inlineStart";
        map.left = "inlineEnd";
        break;
    }

    // reverse inline
    switch (writingModes.direction) {
      case "rtl":
        {
          const {
            inlineStart: physicalInlineStart,
            inlineEnd: physicalInlineEnd,
          } = map;

          map.inlineStart = physicalInlineEnd;
          map.inlineEnd = physicalInlineStart;
          map[physicalInlineStart] = "inlineEnd";
          map[physicalInlineEnd] = "inlineStart";
        }
        break;
    }

    return map;
  }, [writingModes.writingMode, writingModes.direction]);

  const logicalConverter = useCallback<LogicalConverter>(
    <TRecord extends ConvertibleRecord<unknown>>(record: TRecord) => {
      return Object.fromEntries(
        Object.entries(record).map(([key, value]) => [
          key in logicalConverterMap
            ? logicalConverterMap[key as keyof LogicalConverterMap]
            : key,
          value,
        ])
      ) as ConvertedRecord<TRecord>;
    },
    [logicalConverterMap]
  );

  return logicalConverter;
}
