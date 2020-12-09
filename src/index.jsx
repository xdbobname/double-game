class GamePaint extends React.Component{
    constructor(props) {
        super(props);
        this.paintData = props.paintData;
        this.state={
            data: [{x:40,y:60},{x:40,y:80},{x:60,y:80}],
            goal: [],
            nextDirection: { x: 0, y: 1 },
        }
        this.tempDirection = { x: 0, y: 1 }
        this.running = false;
        this.paintBoard = React.createRef()
        this.drawRec = this.drawRec.bind(this);
        this.drawBackground = this.drawBackground;
        this.toStart = this.toStart.bind(this)

    }
    componentDidMount() {
        this.drawBackground();
        this.drawData(this.state.data,0,{direction:{x:0,y:0},tailDirection:{x:0,y:0}});
        //console.log(board);
    }
    drawBackground() {
        //console.log("start");
        const canvas = this.paintBoard.current;
        const board = canvas.getContext('2d');
        board.fillStyle = 'black';
        board.fillRect(0,0,canvas.width,canvas.height)
        board.lineWidth = 1;
        board.beginPath();
        board.strokeStyle = "red";
        for (let i = 0; i <= 600; i += 20){
            board.moveTo(i, 0);
            board.lineTo(i, canvas.height);
        }
        for (let j = 0; j < 400; j += 20){
            board.moveTo(0, j);
            board.lineTo(canvas.width, j);
        }
        board.stroke();
        ///this.background=canvas.toDataURL("image/webp")
    }

    getDirection() {
        const data = this.state.data;
        const de1 = data[0];
        const de2 = data[1];

        return {
            direction: this.state.nextDirection,
            tailDirection: {
                x: (de2.x - de1.x)/20,
                y:(de2.y-de1.y)/20
            }
        }
    }
    drawData(data,dis,dir) {
        const board = this.paintBoard.current.getContext('2d');
        board.lineWidth = 2;
        board.fillStyle = "lime"
        //console.log(dis,data);
        for (let i = 0; i < data.length; i++) {
            let d = data[i];
            if (i == 0) {
                board.fillRect(d.x+dir.tailDirection.x*dis, d.y+dir.tailDirection.y*dis, 20, 20);
            } else {
                board.fillRect(d.x, d.y, 20, 20);
            }
        }
        let dx = data[data.length - 1]
        board.fillRect(dx.x+dir.direction.x*dis, dx.y+dir.direction.y*dis, 20, 20);
    }
    
    toStart(curDir) {
        this.tempDirection = curDir;
        if (this.running) {
            
            return;
        }
        this.running = true;
        const dir = this.getDirection();
        //console.log(dir);
        const data = this.state.data;
        const dx = data[data.length - 1];
        let dis = 2;
            //console.log(1);
            const cb = () => {
                this.drawBackground();
                this.drawData(this.state.data, dis,dir)
                dis++;
                if (dis <= 20) {
                    requestAnimationFrame(cb);
                    return;
                }
                this.setState({
                    nextDirection: this.tempDirection,
                    data: this.state.data.slice(1).concat({x:dx.x+dir.direction.x*20,y:dx.y+dir.direction.y*20})
                })
                this.running = false;
                this.toStart(this.tempDirection)
            }
        requestAnimationFrame(cb)
    }
    drawRec() {
        console.log(this.paintBoard.current);
        const board = this.paintBoard.current.getContext('2d');
        board.lineWidth = 2;
        var x1 = 100, y1 = 50,x2=33,y2=33;
        board.strokeRect(x1, y1, 400, 300)
        board.fillRect(x2, y2, 100, 50)
        const cb= (time) => {
            // board.clearRect(x1-1, y1-1, 402, 302)
            // board.clearRect(x2 - 1, y2 - 1, 102, 52)
            this.drawBackground();
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
            <button onClick={this.toStart}>start</button>
        </div>)
    }
}
