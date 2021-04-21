import { Router } from "express";
import {
  selectAllSeats,
  selectTableSeats,
  selectPlayerSeat,
  assignSeat,
} from "../../store/features/seatsSlice";
import { selectTableIds } from "../../store/features/tablesSlice";
import {selectPlayerIds} from "../../store/features/playersSlice";
import store from "../../store";

const router = Router();

router.get("/", (req, res) => {
  return res.json(selectAllSeats(store.getState()));
});

router.get("/table/:tableID", (req, res) => {
  const { tableID } = req.params;
  const intTableID = parseInt(tableID);
  const state = store.getState();
  if (isNaN(intTableID)) {
    return res
      .status(400)
      .json({ id: tableID, error: "Table IDs must be integers." });
  }
  const tableIDs = selectTableIds(state);
  if (!Array.prototype.includes.call(tableIDs, intTableID)) {
    return res.status(404).json({ id: tableID, error: "Table not found" });
  }
  const selectorResult = selectTableSeats(state, intTableID);
  return res.json(selectorResult);
});

router.get("/player/:PlayerID", (req, res) => {
  const { PlayerID } = req.params;
  const state = store.getState();
  const selectorResult = selectPlayerSeat(state, PlayerID);
  if (selectorResult.length == 0) {
    return res
      .status(404)
      .json({ playerName: PlayerID, error: "Player not found" });
  } else if (selectorResult.length > 1) {
    return res.status(500).json({
      id: PlayerID,
      error: "Duplicate records found for player seat",
      records: selectorResult,
    });
  }
  return res.json(selectorResult);
});

router.post("/assign", (req, res) => {
  const { playerName, table, position } = req.body;
  const intTable = parseInt(table);
  const intPosition = parseInt(position);
  const state = store.getState();
  const playerIds = selectPlayerIds(state);
  const tableIds = selectTableIds(state);
  const errors = [];
  if (playerName === undefined) {
    errors.push("playerName is required");
  }
  else if(!Array.prototype.includes.call(playerIds, playerName)){
    errors.push(`player ${playerName} not found`)
  }
  if (table === undefined) {
    errors.push("table is required");
  }
  else if (isNaN(intTable) || intTable < 0) {
    errors.push("table identifiers must be non-negative integers");
  }
  else if(!Array.prototype.includes.call(tableIds, intTable)){
    errors.push(`table ${intTable} not found}`);
  }
  if (position === undefined) {
    errors.push("position is required");
  }
  else if ((isNaN(intPosition) || intPosition < 0)) {
    errors.push("position must be a non-negative integer");
  }
  if (errors.length > 0) {
    return res.status(400).json({ playerName, table, position, errors });
  }
  const result = store.dispatch(
    assignSeat(playerName, intTable, intPosition)
  );
  return res.json(result);
});

export default router;
