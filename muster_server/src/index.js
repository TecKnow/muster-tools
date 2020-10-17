import express from "express";
import { app, server, io, application_static_path } from "./express-app";
import apiRoutes from "./routes/api";

app.use("/api", apiRoutes);
app.use("/", express.static(application_static_path));

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
