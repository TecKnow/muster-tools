import { Router } from "express";
import playersRouter from "./players";
import tablesRouter from "./tables";
import seatsRouter from "./seats";
const router = Router();

router.use("/players", playersRouter);
router.use("/tables", tablesRouter);
router.use("/seats", seatsRouter);

export default router;
