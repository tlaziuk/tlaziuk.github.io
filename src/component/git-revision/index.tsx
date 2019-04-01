import { Component } from "react";

export default class GitRevision extends Component<any> {
    public shouldComponentUpdate() {
        return false;
    }

    public render() {
        return `${process.env.GIT_REV}`;
    }
}
