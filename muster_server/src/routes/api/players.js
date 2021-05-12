import { Router } from "express";
import {
  addPlayer,
  removePlayer,
} from "@grumbleware/event-muster-store";
import { io } from "../../express-app";
import * as db from "../../sequelize";
const router = Router();

const getPlayers = async () => {
  return await db.selectAllPlayers();
};

router.get("/", async (req, res) => {
  return await db.sequelize.transaction(async () =>
    res.json(await getPlayers())
  );
});

router.post("/", async (req, res) => {
  const { name } = req.body;
  if (!name) {
    return res.status(400).json({ error: "Name is required." });
  }
  return await db.sequelize.transaction(async () => {
  const selectorResult = await db.selectPlayerById(name);
  if (selectorResult) {
    return res
      .status(409)
      .json({ id: name, error: "A player with that name already exists." });
  }

    await db.addPlayer(name);
    const action = addPlayer(name);
    io.emit(action);

    return res.status(201).json();
  });
});

router.delete("/:name", async (req, res) => {
  const { name } = req.params;
  return db.sequelize.transaction(async () => {
    const player = await db.selectPlayerById(name);
    if (!player) {
      return res.status(404).json({ id: name, error: "Player not found." });
    }
    await db.removePlayer(name);
    const action = removePlayer(name);
    io.emit(action);
    return res.json();
  });
});

export default router;
