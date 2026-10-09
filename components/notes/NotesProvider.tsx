"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState, useSyncExternalStore } from "react";
import ButtonBase from "@mui/material/ButtonBase";
import Box from "@mui/material/Box";
import { notesColors } from "./notesColors";

const STORAGE_KEY = "design-notes";

type NotesValue = {
  on: boolean;
  openId: string | null;
  setOpenId: (id: string | null) => void;
};

const NotesContext = createContext<NotesValue>({ on: false, openId: null, setOpenId: () => {} });

export const useNotes = () => useContext(NotesContext);

function readInitial(): boolean {
  try {
    const param = new URLSearchParams(window.location.search).get("notes");
    if (param === "on") return true;
    if (param === "off") return false;
  } catch {
    // fall through to storage
  }
  try {
    return window.localStorage.getItem(STORAGE_KEY) === "on";
  } catch {
    return false;
  }
}

// The on/off state lives outside React so it survives page changes and is read from the URL or storage on the client only.
let stored: boolean | null = null;
const listeners = new Set<() => void>();
const subscribe = (listener: () => void) => {
  listeners.add(listener);
  return () => void listeners.delete(listener);
};
const getSnapshot = () => {
  if (stored === null) {
    stored = readInitial();
    if (new URLSearchParams(window.location.search).has("notes")) writeStorage(stored);
  }
  return stored;
};
const getServerSnapshot = () => false;

function writeStorage(value: boolean) {
  try {
    window.localStorage.setItem(STORAGE_KEY, value ? "on" : "off");
  } catch {
    // storage can be blocked; the state still holds for this visit
  }
}

function setStored(next: boolean) {
  stored = next;
  writeStorage(next);
  listeners.forEach((l) => l());
}

export default function NotesProvider({ children }: { children: React.ReactNode }) {
  const on = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const [openId, setOpenId] = useState<string | null>(null);

  useEffect(() => {
    if (!openId) return;
    const onPointerDown = (e: PointerEvent) => {
      const target = e.target as Element | null;
      if (target?.closest("[data-note-hotspot], [data-note-tooltip]")) return;
      setOpenId(null);
    };
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpenId(null);
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [openId]);

  const toggle = useCallback(() => {
    setStored(!getSnapshot());
    setOpenId(null);
  }, []);

  const value = useMemo(() => ({ on, openId, setOpenId }), [on, openId]);

  return (
    <NotesContext.Provider value={value}>
      {children}
      <ButtonBase
        onClick={toggle}
        aria-pressed={on}
        sx={(t) => ({
          position: "fixed",
          top: 20,
          left: "50%",
          transform: "translateX(-50%)",
          zIndex: 1250,
          width: 240,
          height: 50,
          borderRadius: "48px",
          bgcolor: on ? notesColors.accent : notesColors.white,
          border: `1px solid ${on ? notesColors.white : notesColors.accent}`,
          color: on ? notesColors.white : notesColors.accent,
          fontFamily: t.typography.fontFamily,
          fontSize: 20,
          lineHeight: "32px",
          fontWeight: t.typography.fontWeightMedium,
          "&:focus-visible": { outline: `2px solid ${notesColors.accent}`, outlineOffset: 3 },
        })}
      >
        {/* Soft pink blur behind the pill; this is the part that pulses */}
        <Box
          aria-hidden
          sx={{
            position: "absolute",
            inset: -1,
            zIndex: -1,
            borderRadius: "48px",
            bgcolor: notesColors.glow,
            filter: "blur(9.1px)",
            animation: "notesPillGlow 2.4s ease-in-out infinite",
            "@keyframes notesPillGlow": {
              "0%, 100%": { transform: "scale(1)", opacity: 1 },
              "50%": { transform: "scale(1.06)", opacity: 0.55 },
            },
            "@media (prefers-reduced-motion: reduce)": { animation: "none" },
          }}
        />
        {on ? "Hide design notes" : "Show design notes"}
      </ButtonBase>
    </NotesContext.Provider>
  );
}
