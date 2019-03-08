import * as React from "react";
import {hot} from "react-hot-loader/root.js";

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    componentDidMount() {
        import("./foo.js").then(Foo => this.setState({Foo: Foo.default}));
        import("./bar.js").then(Bar => this.setState({Bar: Bar.default}));
    }

    render() {
        const {Foo, Bar} = this.state;
        return <div>
            <h1>Hello, world</h1>
            {Foo && <Foo/>}
            {Bar && <Bar/>}
        </div>;
    }
}

export default hot(App);
