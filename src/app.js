import { Server, dbConnection, envVariables, MySocket } from "./configs";
import { defaultMiddleware, errorHandleMiddleware } from "./middlewares";
import {
  authRoute,
  adminRoute,
  profileRoute,
  foodRoute,
  cartRoute,
  orderRoute,
  feedbackRoute,
  wishlistRoute,
  shipperRoute,
} from "./routers";
const { port, connectString } = envVariables;
const main = async () => {
  const server = new Server(port);

  server.registerMiddleware(defaultMiddleware);
  server.listen();
  dbConnection(connectString);
  new MySocket(server);
  const io = MySocket.prototype.getInstance();
  io.on("connection", (socket) => {
    console.log("New client connect!");
  });
  server.registerRouter(authRoute);
  server.registerRouter(adminRoute);
  server.registerRouter(profileRoute);
  server.registerRouter(foodRoute);
  server.registerRouter(cartRoute);
  server.registerRouter(orderRoute);
  server.registerRouter(feedbackRoute);
  server.registerRouter(wishlistRoute);
  server.registerRouter(shipperRoute);
  server.registerMiddleware(errorHandleMiddleware);
};
main();
