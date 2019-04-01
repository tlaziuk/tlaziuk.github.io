import { Component } from "react";

const date = new Date(Number(process.env.TIMESTAMP));

export default class BuildDate extends Component {
    public shouldComponentUpdate() {
        return false;
    }

    public render() {
        return date.toISOString();
    }
}
