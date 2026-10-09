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
          left: 16,
          bottom: 16,
          zIndex: 1250,
          display: "flex",
          alignItems: "center",
          gap: 1,
          pl: 1.5,
          pr: 2,
          py: 1,
          borderRadius: `${t.custom.radius.pill}px`,
          bgcolor: notesColors.ink,
          color: notesColors.onInk,
          boxShadow: "0 4px 16px rgba(0, 0, 0, 0.3)",
          ...t.typography.body2,
          fontWeight: t.typography.fontWeightMedium,
          "&:focus-visible": { outline: `2px solid ${notesColors.accent}`, outlineOffset: 2 },
        })}
      >
        <Box
          component="span"
          aria-hidden
          sx={{
            width: 10,
            height: 10,
            borderRadius: "50%",
            bgcolor: notesColors.accent,
            ...(!on && {
              animation: "notesPulse 2s ease-in-out infinite",
              "@keyframes notesPulse": {
                "0%, 100%": { boxShadow: `0 0 0 0 ${notesColors.accent}99` },
                "50%": { boxShadow: `0 0 0 6px ${notesColors.accent}00` },
              },
              "@media (prefers-reduced-motion: reduce)": { animation: "none" },
            }),
          }}
        />
        {on ? "Hide design notes" : "Show design notes"}
      </ButtonBase>
    </NotesContext.Provider>
  );
}
