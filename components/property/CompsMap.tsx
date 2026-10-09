"use client";

import { useMemo } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { MapContainer, Marker, TileLayer, Tooltip, useMap } from "react-leaflet";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import ButtonBase from "@mui/material/ButtonBase";
import { useTheme } from "@mui/material/styles";
import AddOutlined from "@mui/icons-material/AddOutlined";
import ExpandMoreOutlined from "@mui/icons-material/ExpandMoreOutlined";
import RemoveOutlined from "@mui/icons-material/RemoveOutlined";
import { comps, subject } from "@/data/property";

const MAP_HEIGHT = 454;
const ZOOM = 15;
const MARKER_SIZE = 24;
const MARKER_RING = 2;

function ZoomControls() {
  const map = useMap();
  const t = useTheme();
  const squareSx = {
    minWidth: 0,
    p: 1,
    bgcolor: "background.paper",
    color: "text.primary",
    border: 1,
    borderColor: "divider",
    boxShadow: t.custom.shadow.low,
    "&:hover": { bgcolor: "background.paper" },
  } as const;
  return (
    <Box
      ref={(el: HTMLElement | null) => {
        if (el) {
          L.DomEvent.disableClickPropagation(el);
          L.DomEvent.disableScrollPropagation(el);
        }
      }}
      sx={{ position: "absolute", right: 31, bottom: 20, zIndex: 1000, display: "flex", alignItems: "flex-end", gap: 2 }}
    >
      <Button
        endIcon={<ExpandMoreOutlined sx={{ fontSize: 16 }} />}
        sx={{
          px: 2.5,
          py: 1,
          bgcolor: "background.paper",
          color: "text.primary",
          border: 1,
          borderColor: "divider",
          boxShadow: t.custom.shadow.lowSoft,
          "&:hover": { bgcolor: "background.paper" },
        }}
      >
        Map
      </Button>
      <Box sx={{ display: "flex", flexDirection: "column" }}>
        <ButtonBase aria-label="Zoom in" onClick={() => map.zoomIn()} sx={{ ...squareSx, borderRadius: "4px 4px 0 0" }}>
          <AddOutlined />
        </ButtonBase>
        <ButtonBase aria-label="Zoom out" onClick={() => map.zoomOut()} sx={{ ...squareSx, borderRadius: "0 0 4px 4px" }}>
          <RemoveOutlined />
        </ButtonBase>
      </Box>
    </Box>
  );
}

export default function CompsMap({ selectedId, onSelect }: { selectedId: number; onSelect: (id: number) => void }) {
  const t = useTheme();
  const fontSize = t.typography.caption.fontSize as number;

  const icons = useMemo(() => {
    const base = `box-sizing:border-box;border-radius:${t.custom.radius.pill}px;background:${t.palette.common.white};padding:${MARKER_RING}px;box-shadow:${t.shadows[1]}`;
    const inner = `width:100%;height:100%;border-radius:${t.custom.radius.pill}px;display:flex;align-items:center;justify-content:center`;
    const subjectIcon = L.divIcon({
      className: "",
      iconSize: [MARKER_SIZE, MARKER_SIZE],
      html: `<div style="${base};width:${MARKER_SIZE}px;height:${MARKER_SIZE}px"><div style="${inner};background:${t.palette.accent.orange.main}"><img src="/assets/subject-star.svg" alt="" width="16" height="16"/></div></div>`,
    });
    const compIcon = (n: number, color: string, selected: boolean) =>
      L.divIcon({
        className: "",
        iconSize: [MARKER_SIZE, MARKER_SIZE],
        html: `<div style="${base};width:${MARKER_SIZE}px;height:${MARKER_SIZE}px;${selected ? `outline:2px solid ${t.palette.primary.main}` : ""}"><div style="${inner};background:${color};color:${t.palette.common.white};font-family:${t.typography.fontFamily};font-size:${fontSize}px;font-weight:${t.typography.fontWeightMedium}">${n}</div></div>`,
      });
    return { subjectIcon, compIcon };
  }, [t, fontSize]);

  return (
    <Box sx={(th) => ({ position: "relative", height: MAP_HEIGHT, borderRadius: `${th.custom.radius.md}px`, overflow: "hidden", "& .leaflet-container": { height: "100%", width: "100%", fontFamily: th.typography.fontFamily } })}>
      <MapContainer center={[subject.lat, subject.lng]} zoom={ZOOM} zoomControl={false} scrollWheelZoom={false}>
        <TileLayer
          attribution='Tiles &copy; Esri, HERE, Garmin, &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}"
          maxNativeZoom={16}
        />
        <Marker position={[subject.lat, subject.lng]} icon={icons.subjectIcon} zIndexOffset={1000}>
          <Tooltip direction="top" offset={[0, -12]}>{`${subject.street} (subject)`}</Tooltip>
        </Marker>
        {comps.map((c) => (
          <Marker
            key={c.id}
            position={[c.lat, c.lng]}
            icon={icons.compIcon(c.id, c.status === "Sold" ? t.palette.accent.purple.main : t.palette.accent.teal.main, c.id === selectedId)}
            zIndexOffset={c.id === selectedId ? 500 : 0}
            eventHandlers={{ click: () => onSelect(c.id) }}
          >
            <Tooltip direction="top" offset={[0, -12]}>{`${c.street}, ${c.status.toLowerCase()}`}</Tooltip>
          </Marker>
        ))}
        <ZoomControls />
      </MapContainer>
    </Box>
  );
}
