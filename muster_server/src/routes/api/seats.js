import { Router } from "express";
import {
  assignSeat,
  resetSeats,
  shuffleZero,
} from "@grumbleware/event-muster-store";
import { io } from "../../express-app";
import * as db from "../../sequelize";

const router = Router();

router.get("/", async (req, res) => {
  return res.json(
    await db.sequelize.transaction(async () => await db.selectAllSeats())
  );
});

router.get("/table/:tableID", async (req, res) => {
  return db.sequelize.transaction(async () => {
    const { tableID } = req.params;
    const intTableID = parseInt(tableID);
    if (isNaN(intTableID)) {
      return res
        .status(400)
        .json({ id: tableID, error: "Table IDs must be integers." });
    }
    const tableExists = await db.selectTableById(intTableID);
    if (!tableExists) {
      return res.status(404).json({ id: tableID, error: "Table not found" });
    }
    const selectorResult = await db.selectSeatsAtTable(intTableID);
    return res.json(selectorResult);
  });
});

router.get("/player/:PlayerID", async (req, res) => {
  return db.sequelize.transaction(async () => {
    const { PlayerID } = req.params;
    const selectorResult = await db.selectSeatById(PlayerID);
    if (!selectorResult) {
      return res
        .status(404)
        .json({ playerName: PlayerID, error: "Player not found" });
    }
    return res.json(selectorResult);
  });
});

router.post("/assign", async (req, res) => {
  return db.sequelize.transaction(async () => {
    const { playerName, table: tableIdentifier, position } = req.body;
    const intTableID = parseInt(tableIdentifier);
    const intPosition = parseInt(position);
    const player = await db.selectPlayerById(playerName);
    const table = await db.selectTableById(tableIdentifier);
    const errors = [];
    if (playerName === undefined) {
      errors.push("playerName is required");
    } else if (!player) {
      errors.push(`player ${playerName} not found`);
    }
    if (tableIdentifier === undefined) {
      errors.push("table is required");
    } else if (isNaN(intTableID) || intTableID < 0) {
      errors.push("table identifiers must be non-negative integers");
    } else if (!table) {
      errors.push(`table ${intTableID} not found}`);
    }
    if (position === undefined) {
      errors.push("position is required");
    } else if (isNaN(intPosition) || intPosition < 0) {
      errors.push("position must be a non-negative integer");
    }
    if (errors.length > 0) {
      return res
        .status(400)
        .json({ playerName, table: tableIdentifier, position, errors });
    }
    await db.assignSeat(playerName, intTableID, intPosition);
    const action = await assignSeat(playerName, intTableID, intPosition);
    io.emit(action);
    return res.json();
  });
});

router.post("/reset", async (req, res) => {
  return db.sequelize.transaction(async () => {
    await db.resetSeats();
    io.emit(resetSeats());
    return res.json();
  });
});

router.post("/shuffle", async (req, res) => {
  return db.sequelize.transaction(async () => {
    const new_positions = await db.shuffleZero();
    io.emit(shuffleZero(new_positions));
    return res.json(new_positions);
  });
});
export default router;
