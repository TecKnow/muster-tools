import express from "express";
import parser from "body-parser";
import apiRoutes from "./routes/api";

const app = new express();
app.use(parser.urlencoded({extended: true}));
app.use("/api", apiRoutes);

const port = process.env.PORT || 3000
app.listen(port);
console.log(`listening on port ${port}`);