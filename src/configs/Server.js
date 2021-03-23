import express from "express";
export class Server {
  constructor(port) {
    this.port = port;
    this.app = express();
  }
  getApp() {
    return this.app;
  }
  registerMiddleware(middleware) {
    middleware(this.app);
  }
  registerRouter(router) {
    this.app.use(router);
  }
  listen() {
    this.app.listen(this.port, () => {
      console.log("Start server at port", this.port);
    });
  }
}
