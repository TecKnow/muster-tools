import { Router } from "express";
import playersRouter from "./players";
const router = Router();

router.use("/players", playersRouter);
router.get("/", (req, res) =>{
  res.send("API route");
});

export default router;