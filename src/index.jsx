class GamePaint extends React.Component{
    constructor(props) {
        super(props);
        if (props.onMove2Next) {
            this.onMove2Next = props.onMove2Next;
        }
        if (props.onCatchGift) {
            this.onCatchGift = props.onCatchGift;
        }
        this.paintData = props.paintData;
        this.state={
            data: [{x:40,y:60},{x:40,y:80},{x:60,y:80}],
            score:0,
            nextDirection: { x: 0, y: 1 },
        }
        this.tempDirection = { x: 0, y: 1 }
        this.running = false;
        this.paintBoard = React.createRef()
        this.drawRec = this.drawRec.bind(this);
        this.drawBackground = this.drawBackground.bind(this);
        this.toStart = this.toStart.bind(this);
        this.drawGift = this.drawGift.bind(this);
        this.geneGift = this.geneGift.bind(this);

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
    geneGift() {
        const canvas = this.paintBoard.current;
        const board = canvas.getContext('2d');
        let baseheight =canvas.height/20|0;
        let basewidth = canvas.width / 20 | 0;
        let x, y;
        do {
            x = 20 * (Math.random() * basewidth | 0);
            y = 20 * (Math.random() * baseheight| 0);
        }
        while (this.state.data.includes({
            x,y
        }))
        //console.log(x,y)
        return {
            x,y
        }
    }
    drawGift(pos) {
        const canvas = this.paintBoard.current;
        const board = canvas.getContext('2d');
        board.fillStyle = "blue";
        board.fillRect(pos.x,pos.y, 20, 20);
    }
    getDirection() {
        const data = this.state.data;
        const de1 = data[0];
        const de2 = data[1];

        return {
            direction: this.state.nextDirection,
            tailDirection: {
                x: Math.sign(de2.x - de1.x),
                y: Math.sign(de2.y-de1.y)
            }
        }
    }
    drawData(data, dis, dir) {
        if (dis == 2) {
            
            let head = data.slice(-1)[0];
            if (Math.abs(head.x - this.gift.x) + Math.abs(head.y - this.gift.y) < 20) {
                //console.log(head,data,dis,dir);
                data.push(
                    this.gift
                )
                this.setState({
                    data
                })
                if (this.onCatchGift) {
                    this.gift = this.geneGift();
                    this.onCatchGift(this.state, this.gift);
                }
            }
        }
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
        if (!this.gift) {
            this.gift = this.geneGift();
            //console.log("fail")
        }
        if(curDir&&(curDir.x+this.state.nextDirection.x||curDir.y+this.state.nextDirection.y))
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
                this.drawGift(this.gift);
                this.drawData(this.state.data, dis,dir)
                dis++;
                if (dis <= 20) {
                    requestAnimationFrame(cb);
                    return;
                }
                this.setState({
                    nextDirection: this.tempDirection,
                    data: this.state.data.slice(1).concat({x:dx.x+dir.direction.x*20,y:dx.y+dir.direction.y*20})
                }, function(){
                    if (this.onMove2Next) {
                    this.onMove2Next(this.state, this.gift);
                }
                })
                setTimeout(() => {
                    this.running = false;
                    this.toStart(this.tempDirection)
                },17)
                
            }
        requestAnimationFrame(cb)
    }
    drawRec() {
        //console.log(this.paintBoard.current);
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
            <button onClick={this.drawRec}>画矩形测试</button>
            <label>{this.state.score} 分</label>
        </div>)
    }
}
