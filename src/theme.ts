import { PaletteType } from "@material-ui/core";
import { createMuiTheme } from "@material-ui/core/styles";

let type: PaletteType;

try {
    type = matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark";
} catch {
    type = "dark";
}

export default createMuiTheme({
    palette: {
        type,
    },
});
