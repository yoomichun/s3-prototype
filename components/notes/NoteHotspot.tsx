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
const RING = 48;
const GAP = 8; // space between the pin and the section it points at

/**
 * Pulsing numbered pin for a design note. Render it inside a `position: relative` section.
 * By default it sits in the gutter, a small gap left of the section's left edge, level with a 24px heading.
 * `top` and `left` are the pin's own top-left corner relative to that section.
 */
export default function NoteHotspot({ id, top = 6, left = -SIZE - GAP }: { id: NoteId; top?: number; left?: number }) {
  const { on, openId, setOpenId } = useNotes();
  const lastPointer = useRef<string>("");
  if (!on) return null;

  const note = designNotes[id];
  const open = openId === id;

  return (
    <Box sx={{ position: "absolute", top, left, width: SIZE, height: SIZE, zIndex: 5 }}>
      {/* Soft pink blur behind the pin; this is the part that pulses */}
      <Box
        aria-hidden
        sx={{
          position: "absolute",
          inset: 0,
          borderRadius: "50%",
          bgcolor: notesColors.glow,
          filter: "blur(9px)",
          animation: "notesGlow 3s ease-in-out infinite",
          "@keyframes notesGlow": {
            "0%, 100%": { transform: "scale(1)", opacity: 1 },
            "50%": { transform: "scale(3)", opacity: 0.2 },
          },
          // Reduce motion: no movement, but the glow still fades in and out so the dot stays easy to find
          "@keyframes notesBreathe": { "0%, 100%": { opacity: 0.2 }, "50%": { opacity: 1 } },
          "@media (prefers-reduced-motion: reduce)": { animation: "notesBreathe 3s ease-in-out infinite" },
        }}
      />
      {/* Ripple ring that expands outward and fades, so the pulse reads clearly */}
      <Box
        aria-hidden
        sx={{
          position: "absolute",
          inset: 0,
          borderRadius: "50%",
          border: `3px solid ${notesColors.accent}`,
          pointerEvents: "none",
          animation: "notesRipple 3s ease-out infinite",
          "@keyframes notesRipple": {
            "0%": { transform: "scale(1)", opacity: 1 },
            "75%, 100%": { transform: "scale(3.4)", opacity: 0 },
          },
          "@keyframes notesRingBreathe": { "0%, 100%": { opacity: 0.1 }, "50%": { opacity: 1 } },
          "@media (prefers-reduced-motion: reduce)": { animation: "notesRingBreathe 3s ease-in-out infinite", transform: "scale(1.8)" },
        }}
      />
      {/* Dashed ring shown while the note is open (hover, tap or focus) */}
      <Box
        aria-hidden
        sx={{
          position: "absolute",
          top: -(RING - SIZE) / 2,
          left: -(RING - SIZE) / 2,
          width: RING,
          height: RING,
          borderRadius: "50%",
          border: `1px dashed ${notesColors.accent}`,
          opacity: open ? 1 : 0,
          transition: "opacity 120ms ease",
          pointerEvents: "none",
        }}
      />
      <Tooltip
        open={open}
        placement="bottom-start"
        title={
          <Box data-note-tooltip sx={{ width: 296 }}>
            <Typography variant="body2" sx={{ fontWeight: "fontWeightMedium", color: notesColors.accent }}>
              {note.headline}
            </Typography>
            <Typography variant="body2" sx={{ color: notesColors.white }}>
              {note.text}
            </Typography>
          </Box>
        }
        slotProps={{
          popper: { sx: { zIndex: 1600 } },
          tooltip: {
            sx: (t) => ({
              maxWidth: "none",
              px: 1.5,
              py: 0.75,
              bgcolor: notesColors.tooltipBg,
              borderRadius: "8px",
              boxShadow: 1,
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
          sx={{
            position: "absolute",
            inset: 0,
            borderRadius: "50%",
            bgcolor: notesColors.accent,
            border: `1px solid ${notesColors.white}`,
            opacity: 0.75,
            animation: "notesDot 3s ease-in-out infinite",
            "@keyframes notesDot": {
              "0%, 100%": { transform: "scale(1)" },
              "50%": { transform: "scale(1.35)" },
            },
            "@media (prefers-reduced-motion: reduce)": { animation: "none" },
          }}
        />
      </Tooltip>
    </Box>
  );
}
