import React, { PureComponent } from "react";
import Game from "../component/2048";
import { withStyles, WithStyles } from "@material-ui/core/styles";

export default withStyles(() => ({
    game: {
        height: "100vmin",
        width: "100vmin",
    },
}))(class Game2048PageComponent extends PureComponent<WithStyles> {
    public render() {
        const {
            classes: {
                game,
            },
        } = this.props;

        return <div className={game}>
            <Game />
        </div>;
    }
});
