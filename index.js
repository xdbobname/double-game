const port = 9501;
const Koa = require("koa2");
const route = require("koa-route");
const websockify = require("koa-websocket");
const app = websockify(new Koa());
const { clientMESType, serverMESType } = require("./type");
let wsMap = new Map();
let allay, enemy;
setInterval(() => {
  //console.log(wsMap.size);
  for (const map of wsMap.values()) {
    let data = {
      type: serverMESType.PING,
      msg: "hello",
    };
    map.send(JSON.stringify(data));
  }
}, 1000);
app.ws.onConnection = (socket, req) => {
  const key = socket._socket.server._connectionKey;
  socket.on("message", (mes) => {
    //console.log(mes);
    const gameData = JSON.parse(mes);
    const { type } = gameData;
    switch (type) {
      case clientMESType.HOST:
        console.log("Host defined");
        allay = socket;
        socket.send(
          JSON.stringify({
            type: serverMESType.HOST,
          })
        );
        break;
      case clientMESType.JOIN:
        console.log("joiner defined");
        enemy = socket;
        socket.send(
          JSON.stringify({
            type: serverMESType.JOIN,
          })
        );
        break;
      case clientMESType.MSG:
        getSocket(socket).send(mes);
        break;
      case clientMESType.gameData:
        getSocket(socket).send(mes);
        break;
      case clientMESType.MOVE:
        getSocket(socket).send(mes);
        break;
      default:
        break;
    }
  });
  function getSocket(socket) {
    if (socket == allay) {
      return enemy;
    } else {
      return allay;
    }
  }
  socket.send(
    JSON.stringify({
      type: serverMESType.CONNECT,
      msg: "hello",
    })
  );
  wsMap.set(key, socket);
  //console.log(wsMap.size);
};
app.ws.use(function (ctx, next) {
  ctx.websocket.send("连接成功");
  return next(ctx);
});
app.ws.use(route.all("/", function (ctx) {}));
console.log(`app listened on localhost:${port}`);
app.listen(port, () => {
  console.log("localhost:" + port);
});
