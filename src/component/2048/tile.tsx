import {
    amber,
    blue,
    lime,
    orange,
    pink,
    purple,
    yellow,
} from "@material-ui/core/colors";
import Paper from "@material-ui/core/Paper";
import { withStyles, WithStyles } from "@material-ui/core/styles";
import React, { PureComponent } from "react";

interface IProps {
    value: number;
}

export default withStyles(
    ({ typography }) => ({
        tile: {
            fontFamily: typography.fontFamily,
            fontWeight: typography.fontWeightMedium,
            height: "100%",
            transitionDuration: "0.25s",
            transitionProperty: "all",
            transitionTimingFunction: "ease-in-out",
            width: "100%",
        },
    }),
    {
        withTheme: true,
    },
)(class Tile2048 extends PureComponent<IProps & WithStyles<string, true>> {
    public render() {
        const {
            classes: {
                tile,
            },
            value,
            theme: {
                palette: {
                    getContrastText,
                    background: {
                        paper: paperBackground,
                    },
                },
            },
        } = this.props;

        let backgroundColor: string;

        switch (value) {
            case 1: {
                backgroundColor = orange.A100;
                break;
            }
            case 2: {
                backgroundColor = yellow.A100;
                break;
            }
            case 4: {
                backgroundColor = amber.A100;
                break;
            }
            case 8: {
                backgroundColor = blue.A100;
                break;
            }
            case 16: {
                backgroundColor = lime.A100;
                break;
            }
            case 32: {
                backgroundColor = purple.A100;
                break;
            }
            case 64: {
                backgroundColor = pink.A100;
                break;
            }
            default: {
                backgroundColor = paperBackground;
                break;
            }
        }

        return <Paper
            className={tile}
            style={{ backgroundColor, color: getContrastText(backgroundColor) }}
        >{value > 0 ? value : undefined}</Paper>;
    }
});
