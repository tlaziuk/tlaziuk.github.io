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
import { makeStyles, Theme } from "@material-ui/core/styles";
import React from "react";

interface IProps {
    value: number;
}

const useStyles = makeStyles(
    (
        {
            typography,
            palette: {
                getContrastText,
                background: {
                    paper: paperBackground,
                },
            },
        }: Theme,
    ) => ({
        svg: {
            height: "100%",
            width: "100%",
        },
        text: {
            fontFamily: typography.fontFamily,
            fontSize: typography.fontSize,
            fontWeight: typography.fontWeightMedium,
        },
        tile: ({ value }: IProps) => {

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

            return {
                backgroundColor,
                color: getContrastText(backgroundColor),
                display: "table",
                height: "100%",
                textAlign: "center",
                transitionDuration: "0.25s",
                transitionProperty: "all",
                transitionTimingFunction: "ease-in-out",
                width: "100%",
            };
        },
    }),
);

export default function Tile2048(props: IProps) {
    const {
        tile,
        text,
        svg,
    } = useStyles(props);
    const { value } = props;

    return <Paper
        className={tile}
    >
        <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" className={svg}>
            <text textAnchor="middle" x="12" y="17" className={text}>{value > 0 ? value : undefined}</text>
        </svg>
    </Paper>;
}
