import { Component } from "react";

interface IProps {
    length?: number;
}

export default class GitRevision extends Component<IProps> {
    public shouldComponentUpdate({ length: nextLength }: Readonly<IProps>) {
        const { length } = this.props;
        return nextLength !== length;
    }

    public render() {
        const { length } = this.props;
        return `${process.env.GIT_REV}`.slice(0, length);
    }
}
