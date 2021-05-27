import { Router } from "express";
import { addTable, removeTable } from "@grumbleware/event-muster-store";
import { io } from "../../express-app";
import * as db from "../../sequelize";
const router = Router();

router.get("/", async (req, res) => {
  return res.json(
    await db.sequelize.transaction(async () => await db.selectAllTables())
  );
});

router.post("/", async (req, res) => {
  return db.sequelize.transaction(async () => {
    const newTable = await db.createTable();
    const action = addTable(newTable.Identifier);
    io.emit("action", action);
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
  console.log("Server found parameters:");
  console.log(JSON.stringify(req.params));
  db.sequelize.transaction(async () => {
    const id = parseInt(req.params.id);
    if (id == 0) {
      return res
        .status(405)
        .json({ id, error: "Default table cannot be deleted." });
    }
    const selector_result = db.selectTableById(id);
    if (!selector_result) {
      return res
        .status(404)
        .json({ Identifier: id, error: "Table does not exist" });
    }
    await db.removeTable(id);
    const action = removeTable(id);
    io.emit("action", action);
    return res.json();
  });
});

export default router;
