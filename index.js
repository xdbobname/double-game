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
        allay = socket;
        break;
      case clientMESType.JOIN:
        enemy = socket;
        break;
      case clientMESType.MSG:
        if (socket == allay) {
          enemy.send(mes);
        } else {
          allay.send(mes);
        }
        break;
      case clientMESType.gameData:
        if (socket == allay) {
          enemy.send(mes);
        } else {
          allay.send(mes);
        }
        break;
      default:
        break;
    }
  });
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
