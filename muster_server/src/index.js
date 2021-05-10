import path from "path";
import express from "express";
import {
  app,
  server,
  io,
  application_root_path,
  application_static_path,
  application_SPA_path,
} from "./express-app";
import { test_connection } from "./sequelize";
import apiRoutes from "./routes/api";

if (process.env.NODE_ENV === "production") {
  app.use("/", express.static(application_static_path));
  app.get("/*", (req, res) => {
    res.sendFile(application_SPA_path);
  });
} else {
  app.get("/", (req, res) => {
    res.sendFile(
      path.join(application_root_path, "/muster_server/public/index.html")
    );
  });
}

// NOTE: Right now the server's own static files, which contain only the chat-style interface, don't get served.
app.use("/api", apiRoutes);

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
