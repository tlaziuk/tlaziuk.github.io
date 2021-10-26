import { createTheme, PaletteMode } from "@mui/material";
import type { Theme } from "@mui/material/styles";

declare module "@mui/styles/defaultTheme" {
  interface DefaultTheme extends Theme {}
}

let mode: PaletteMode;

try {
  mode = matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark";
} catch {
  mode = "dark";
}

const theme = createTheme({
  palette: {
    mode,
  },
});

export default theme;
