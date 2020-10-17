import path from "path";
import express from "express";
import {app, server, io} from "./express-app";
import apiRoutes from "./routes/api";


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
