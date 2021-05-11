import { Router } from "express";
import {
  createTable,
  removeTable,
} from "@grumbleware/event-muster-store";
import { io } from "../../express-app";
import * as db from "../../sequelize";

const router = Router();

const getTables = async () => {
  return await db.selectTableIds();
};

router.get("/", async (req, res) => {
  return res.json(
    await db.sequelize.transaction(async () => await getTables())
  );
});

router.post("/", async (req, res) => {
  return db.sequelize.transaction(async () => {
    const newTable = await db.createTable();
    const action = createTable(newTable.Identifier);
    io.emit(action);
    return res.status(201).json(newTable.Identifier);
  });
});

router.get("/:id", async (req, res) => {
  return db.sequelize.transaction(async () => {
    const { id } = req.params;
    const tableExists = await db.selectTableById(id);
    if (!tableExists) {
      return res
        .status(404)
        .json({ Identifier: id, error: "Table not found." });
    }
    const selector_result = await db.selectSeatsAtTable(id);
    return res.json(selector_result);
  });
});

router.delete("/:id", async (req, res) => {
  db.sequelize.transaction(async () => {
    const { id } = req.params;
    if (id == 0) {
      return res
        .status(405)
        .json({ id, error: "Default table cannot be deleted." });
    }
    const selector_result = db.selectTableById(id);
    if (!selector_result) {
      return res.status(404).json({ Identifier: id, error: "Table does not exist" });
    }
    await db.removeTable(id);    
    const action = removeTable(id);
    io.emit(action);
    return res.json();
  });
});

export default router;
