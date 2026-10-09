"use client";

import Box from "@mui/material/Box";
import type { TooltipProps } from "@mui/material/Tooltip";
import type { NoteId } from "@/data/designNotes";
import NoteHotspot from "./NoteHotspot";

const SIZE = 24;
const GAP = 8;

// Where the pin sits relative to the wrapped element: beside it, never on top of it, centered on the cross axis.
const positions = {
  right: { top: `calc(50% - ${SIZE / 2}px)`, left: `calc(100% + ${GAP}px)` },
  left: { top: `calc(50% - ${SIZE / 2}px)`, left: -(SIZE + GAP) },
  top: { top: -(SIZE + GAP), left: `calc(50% - ${SIZE / 2}px)` },
  bottom: { top: `calc(100% + ${GAP}px)`, left: `calc(50% - ${SIZE / 2}px)` },
} as const;

/** Wraps a clickable element and puts the design note pin beside it. */
export default function NoteAnchor({
  id,
  side = "right",
  placement,
  children,
}: {
  id: NoteId;
  side?: keyof typeof positions;
  placement?: TooltipProps["placement"];
  children: React.ReactNode;
}) {
  return (
    <Box sx={{ position: "relative", display: "inline-flex" }}>
      {children}
      <NoteHotspot id={id} placement={placement} {...positions[side]} />
    </Box>
  );
}
