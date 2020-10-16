import path from "path";
import http from "http";
import express from "express";
import parser from "body-parser";
import socket_io from "socket.io";
import apiRoutes from "./routes/api";

const app = new express();
const server = http.createServer(app);
const io = socket_io(server);
app.use(parser.urlencoded({ extended: true }));
app.use("/api", apiRoutes);

const application_root_path = path.join(__dirname, "/../")
const static_path = path.join(application_root_path, "/public")

app.use("/", express.static(static_path));

const port = process.env.PORT || 3000;
server.listen(port);
console.log(`listening on port ${port}`);

io.on("connection", (socket) => {
  console.log("a user connected");
  socket.on("chat message", (msg) => {
    console.log(`message: ${msg}`);
  });
  socket.on("disconnect", () => {
    console.log("a user has disconnected");
  });
});
