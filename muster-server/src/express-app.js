import path from "path";
import http from "http";
import express from "express";
import socket_io from "socket.io";

export const application_root_path = path.join(__dirname, "/../../");
export const application_static_path = path.join(
  application_root_path,
  "/muster-client/build"
);
export const application_SPA_path = path.join(
  application_static_path,
  "index.html"
);

export const app = new express();
export const server = http.createServer(app);
export const io = socket_io(server);

app.use(express.urlencoded({ extended: true }));

export default app;
