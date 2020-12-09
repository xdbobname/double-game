const port = 9501;
const Koa = require("koa2");
const route = require("koa-route");
const websockify = require("koa-websocket");
const app = websockify(new Koa());
app.ws.use(function (ctx, next) {
  ctx.websocket.send("连接成功");
  return next(ctx);
});
app.ws.use(
  route.all("/", function (ctx) {
    ctx.websocket.on("message", function (message) {
      console.log(message);
      let data = JSON.stringify({
        type: "action",
        userData: {
          data: [],
          nextDirection: {
            x: 0,
            y: 0,
          },
        },
        enemyData: {
          data: [],
          nextDirection: {
            x: 0,
            y: 0,
          },
        },
      });
      ctx.websocket.send(data);
    });
  })
);
console.log(`app listened on localhost:${port}`);
app.listen(port, () => {
  console.log("localhost:" + port);
});
