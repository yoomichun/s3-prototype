"use client";

import { useRef } from "react";
import Box from "@mui/material/Box";
import ButtonBase from "@mui/material/ButtonBase";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import { designNotes, type NoteId } from "@/data/designNotes";
import { notesColors } from "./notesColors";
import { useNotes } from "./NotesProvider";

const SIZE = 24;

/**
 * Numbered hotspot for a design note. Render it inside a `position: relative` section;
 * by default it sits centered on that section's top-left corner so it doesn't cover content.
 */
export default function NoteHotspot({ id, top = -SIZE * 0.7, left = -SIZE * 0.6 }: { id: NoteId; top?: number; left?: number }) {
  const { on, openId, setOpenId } = useNotes();
  const lastPointer = useRef<string>("");
  if (!on) return null;

  const note: { n: number; headline: string; text: string; placement?: "left-start" } = designNotes[id];
  const open = openId === id;

  return (
    <Tooltip
      open={open}
      placement={note.placement ?? "bottom-start"}
      title={
        <Box data-note-tooltip sx={{ width: 276 }}>
          <Typography variant="body2" sx={{ fontWeight: 700, color: notesColors.accent, mb: 0.5 }}>
            {note.headline}
          </Typography>
          <Typography variant="body2" sx={{ color: notesColors.onInk }}>
            {note.text}
          </Typography>
        </Box>
      }
      slotProps={{
        popper: { sx: { zIndex: 1600 } },
        tooltip: {
          sx: (t) => ({
            maxWidth: "none",
            p: 1.5,
            bgcolor: notesColors.ink,
            borderRadius: `${t.custom.radius.md}px`,
            boxShadow: "0 8px 24px rgba(0, 0, 0, 0.35)",
            ...t.typography.body2,
          }),
        },
      }}
    >
      <ButtonBase
        data-note-hotspot
        aria-label={`Design note ${note.n}: ${note.headline}`}
        aria-expanded={open}
        onPointerDown={(e) => {
          lastPointer.current = e.pointerType;
        }}
        onPointerEnter={(e) => e.pointerType === "mouse" && setOpenId(id)}
        onPointerLeave={(e) => e.pointerType === "mouse" && open && setOpenId(null)}
        onClick={() => setOpenId(open && lastPointer.current !== "mouse" ? null : id)}
        onFocus={(e) => e.currentTarget.matches(":focus-visible") && setOpenId(id)}
        onBlur={() => open && setOpenId(null)}
        sx={(t) => ({
          position: "absolute",
          top,
          left,
          zIndex: 5,
          width: SIZE,
          height: SIZE,
          borderRadius: "50%",
          bgcolor: notesColors.accent,
          color: notesColors.ink,
          border: `2px solid ${notesColors.ink}`,
          boxShadow: "0 2px 8px rgba(0, 0, 0, 0.35)",
          ...t.typography.caption,
          fontWeight: 700,
          lineHeight: 1,
          transition: "transform 120ms ease",
          "&:hover, &[aria-expanded='true']": { transform: "scale(1.15)" },
          "&:focus-visible": { outline: `2px solid ${notesColors.ink}`, outlineOffset: 2 },
        })}
      >
        {note.n}
      </ButtonBase>
    </Tooltip>
  );
}
