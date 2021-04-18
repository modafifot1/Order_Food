import { Server, dbConnection, envVariables } from "./configs";
import { defaultMiddleware, errorHandleMiddleware } from "./middlewares";
import { authRoute, adminRoute, profileRoute, foodRoute } from "./routers";
const { port, connectString } = envVariables;
const main = async () => {
  const server = new Server(port);
  server.registerMiddleware(defaultMiddleware);
  server.listen();
  dbConnection(connectString);
  server.registerRouter(authRoute);
  server.registerRouter(adminRoute);
  server.registerRouter(profileRoute);
  server.registerRouter(foodRoute);
  server.registerMiddleware(errorHandleMiddleware);
};
main();
