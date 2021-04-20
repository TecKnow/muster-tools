import { Router } from "express";
import store from "../../store";
import playersRouter from "./players";
import tablesRouter from "./tables";
import seatsRouter from "./seats";
const router = Router();

router.use("/players", playersRouter);
router.use("/tables", tablesRouter);
router.use("/seats", seatsRouter);
router.get("/", (req, res) => {
  res.json(store.getState());
});

export default router;
