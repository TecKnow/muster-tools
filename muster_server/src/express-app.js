import http from "http";
import express from "express";
import parser from "body-parser";
import socket_io from "socket.io";

export const app = new express();
export const server = http.createServer(app);
export const io = socket_io(server);

app.use(parser.urlencoded({ extended: true }));

export default app;