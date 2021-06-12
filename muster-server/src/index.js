import express from "express";
import {
  app,
  server,
  io,
  application_static_path,
  application_SPA_path,
} from "./express-app";
import { test_connection } from "./sequelize";
import apiRoutes from "./routes/api";

app.use("/api", apiRoutes);
app.use("/", express.static(application_static_path));
app.get("/*", (req, res) => {
  res.sendFile(application_SPA_path);
});

const port = process.env.PORT || 5000;
server.listen(port);
console.log(`listening on port ${port}`);
test_connection();

io.on("connection", (socket) => {
  console.log("a user connected");
  socket.on("action", (msg) => {
    console.log(`action: ${msg}`);
  });
  socket.on("disconnect", () => {
    console.log("a user has disconnected");
  });
});
