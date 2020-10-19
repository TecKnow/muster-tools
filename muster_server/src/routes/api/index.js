import { Router } from "express";
import storePromise from "../../store";
import playersRouter from "./players";
import tablesRouter from "./tables"
const router = Router();

router.use("/players", playersRouter);
router.use("/tables", tablesRouter);
router.get("/", async (req, res) => {
  const store = await storePromise;
  res.json(store.getState());
});

export default router;
