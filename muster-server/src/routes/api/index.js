import { Router } from "express";
import * as db from "../../sequelize";
import { io } from "../../express-app";
import playersRouter from "./players";
import tablesRouter from "./tables";
import seatsRouter from "./seats";
import { systemReset } from "@grumbleware/event-muster-store";
const router = Router();

router.use("/players", playersRouter);
router.use("/tables", tablesRouter);
router.use("/seats", seatsRouter);

router.post("/systemReset", async (req, res) => {
  return await db.sequelize.transaction(async () => {
    await db.systemReset();
    const action = systemReset();
    io.emit("action", action);
    return res.json();
  });
});

export default router;
