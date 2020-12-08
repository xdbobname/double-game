class GamePaint extends React.Component{
    constructor(props) {
        super(props);
        this.paintData = props.paintData;
        this.state={
            data: [],
            goal: [],
            length: 0
        }
        this.paintBoard = React.createRef()
        this.drawRec = this.drawRec.bind(this);
    }
    drawRec() {
        console.log(this.paintBoard.current);
        const board = this.paintBoard.current.getContext('2d');
        board.lineWidth = 2;
        var x1 = 100, y1 = 50,x2=33,y2=33;
        board.strokeRect(x1, y1, 400, 300)
        board.fillRect(x2, y2, 100, 50)
        const cb=(time) => {
            board.clearRect(x1-1, y1-1, 402, 302)
            board.clearRect(x2-1, y2-1, 102, 52)
            x1 += 1;
            y1 += 2;
            x2 += 0.5;
            y2 += 0.5;
            board.height = board.height;
            board.strokeRect(x1, y1, 400, 300)
            board.fillRect(x2, y2, 100, 50)
            if (x1 < 400) {
                window.requestAnimationFrame(cb);
            }
        }
        window.requestAnimationFrame(cb);
    }
    render() {
        return (<div className="gameArea">
            <canvas width="600px" height="400px" className="paintBox" ref={this.paintBoard}></canvas>
            <br/>
            <button onClick={this.drawRec}>helo</button>
        </div>)
    }
}
