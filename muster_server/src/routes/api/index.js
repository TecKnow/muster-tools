import { Router } from "express";
import store from "../../store";
import playersRouter from "./players";
import tablesRouter from "./tables";
const router = Router();

router.use("/players", playersRouter);
router.use("/tables", tablesRouter);
router.get("/", (req, res) => {
  res.json(store.getState());
});

export default router;
