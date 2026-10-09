import { createTheme } from "@mui/material/styles";

// All values below come from the Figma variables (file cvZFT0XVVUHwF4gIr27tgA).
// Nav, tab track and some chip fills are raw fills in Figma, not variables.

declare module "@mui/material/styles" {
  interface Palette {
    slate: Record<50 | 100 | 200 | 400 | 500 | 600 | 900, string>;
    accent: {
      pink: { main: string; light: string };
      teal: { main: string; light: string };
      purple: { main: string; light: string };
      orange: { main: string };
    };
    nav: { bg: string; groupOpen: string; subItem: string };
    tabTrack: string;
  }
  interface PaletteOptions {
    slate?: Palette["slate"];
    accent?: Palette["accent"];
    nav?: Palette["nav"];
    tabTrack?: string;
  }
  interface Theme {
    custom: {
      radius: { sm: number; md: number; pill: number };
      shadow: { low: string; lowSoft: string };
      layout: { navWidth: number; navItemWidth: number; rightPanelWidth: number; contentGutter: number };
    };
  }
  interface ThemeOptions {
    custom?: Theme["custom"];
  }
}

const fontFamily = '"Proxima Nova", "Helvetica Neue", Arial, sans-serif';

const base = createTheme();
const shadows = [...base.shadows] as typeof base.shadows;
// Elevation 1
shadows[1] = "0px 2px 16px 0px #1718180D, 0px 1px 4px 0px #1718180A";

const theme = createTheme({
  spacing: 8,
  shape: { borderRadius: 4 },
  shadows,
  palette: {
    primary: { main: "#3F68D2", dark: "#234293", light: "#ECF1FE", contrastText: "#FFFFFF" },
    secondary: { main: "#5E6B85", dark: "#232A35", contrastText: "#FFFFFF" },
    success: { main: "#1FAD78", light: "#E4FBF3" },
    warning: { main: "#E8B10C", light: "#FCF5D9" },
    info: { main: "#2793CE" },
    error: { main: "#EE462F", light: "#FFE8E5" },
    text: { primary: "#232A35", secondary: "#5E6B85", disabled: "#8992A5" },
    divider: "#DFE1E6",
    background: { default: "#FFFFFF", paper: "#FFFFFF" },
    slate: { 50: "#FAFBFC", 100: "#F3F4F6", 200: "#DFE1E6", 400: "#A5ADBA", 500: "#8992A5", 600: "#5E6B85", 900: "#232A35" },
    accent: {
      pink: { main: "#D03988", light: "#FEE7F3" },
      teal: { main: "#2CC2C9", light: "#DBF6F7" },
      purple: { main: "#7D54CF", light: "#EEE7FE" },
      orange: { main: "#FC814F" },
    },
    nav: { bg: "#061D33", groupOpen: "#040F1A", subItem: "#082C42" },
    tabTrack: "#EBEBEB",
  },
  typography: {
    fontFamily,
    fontWeightRegular: 400,
    fontWeightMedium: 600, // Proxima Nova Semibold is the only emphasis weight in the design
    h1: { fontSize: 36, lineHeight: "48px", fontWeight: 600 },
    h2: { fontSize: 28, lineHeight: "40px", fontWeight: 600, letterSpacing: 0 },
    h3: { fontSize: 24, lineHeight: "36px", fontWeight: 600 },
    h4: { fontSize: 20, lineHeight: "32px", fontWeight: 600 },
    h5: { fontSize: 18, lineHeight: "28px", fontWeight: 600 },
    body1: { fontSize: 16, lineHeight: "24px" },
    body2: { fontSize: 14, lineHeight: "20px" },
    caption: { fontSize: 12, lineHeight: "16px" },
    button: { fontSize: 14, lineHeight: "20px", fontWeight: 600, textTransform: "none" },
  },
  components: {
    MuiButton: { defaultProps: { disableElevation: true } },
    MuiSlider: {
      styleOverrides: {
        root: { height: 4, padding: 0 },
        rail: ({ theme: t }) => ({ opacity: 1, backgroundColor: t.palette.slate[200] }),
        track: { border: "none" },
        thumb: { width: 16, height: 16, "&:before": { boxShadow: "none" } },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: ({ theme: t }) => ({
          borderRadius: 4,
          ...t.typography.body1,
          "& .MuiOutlinedInput-notchedOutline": { borderColor: t.palette.slate[400] },
          "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: t.palette.slate[600] },
          "& input::placeholder, & textarea::placeholder": { color: t.palette.text.disabled, opacity: 1 },
        }),
      },
    },
  },
  custom: {
    radius: { sm: 4, md: 8, pill: 32 },
    // "drop shadow/low" in Figma, used by map controls
    shadow: { low: "0px 2px 8px 0px #232A3526", lowSoft: "0px 2px 4px 0px #232A3526" },
    layout: { navWidth: 256, navItemWidth: 240, rightPanelWidth: 330, contentGutter: 24 },
  },
});

export default theme;
