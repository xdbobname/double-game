
//import "./button.css"

class P5Button extends React.Component {

    constructor(prop) {
        super(prop);
    }
    render() {
        const { text, width, height } = this.props;
        return (
            <div className={"comp"}>
                <button className={"btn"}><span className={"text"}>{text}</span></button>
            </div>
        )
    }
}
