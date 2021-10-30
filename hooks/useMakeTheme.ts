import { createTheme, PaletteMode, useMediaQuery, Theme } from "@mui/material";
import { useMemo } from "react";

declare module "@mui/styles/defaultTheme" {
  interface DefaultTheme extends Theme {}
}

export function useMakeTheme(): Theme {
  const mode: PaletteMode = useMediaQuery("(prefers-color-scheme: light)", {
    defaultMatches: false,
  })
    ? "light"
    : "dark";

  return useMemo(
    () =>
      createTheme({
        palette: {
          mode,
        },
      }),
    [mode]
  );
}
