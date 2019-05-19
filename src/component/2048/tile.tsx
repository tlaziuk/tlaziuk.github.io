import {
    amber,
    blue,
    brown,
    grey,
    indigo,
    lime,
    orange,
    pink,
    purple,
    red,
    teal,
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
        svg: {
            height: "100%",
            width: "100%",
        },
        text: {
            fontFamily: typography.fontFamily,
            fontSize: typography.fontSize,
            fontWeight: typography.fontWeightMedium,
        },
        tile: {
            display: "table",
            height: "100%",
            textAlign: "center",
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
                text,
                svg,
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
            case 128: {
                backgroundColor = brown.A100;
                break;
            }
            case 256: {
                backgroundColor = grey.A100;
                break;
            }
            case 512: {
                backgroundColor = teal.A100;
                break;
            }
            case 1024: {
                backgroundColor = indigo.A100;
                break;
            }
            case 2048: {
                backgroundColor = red.A100;
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
        >
            <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" className={svg}>
                <text textAnchor="middle" x="12" y="17" className={text}>{value > 0 ? value : undefined}</text>
            </svg>
        </Paper>;
    }
});
