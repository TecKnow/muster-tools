import { Router } from "express";
import { selectTableIds } from "../../store/features/tablesSlice";
import {
  selectAllSeats,
  selectTableSeats,
  selectPlayerSeat,
} from "../../store/features/seatsSlice";

import store from "../../store";
import { isNull } from "lodash";

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
  const selectorResult = selectTableSeats(state, intTableID);
  if (isNull(selectorResult)) {
    return res.status(404).json({ id: tableID, error: "Table not found" });
  }
  return res.json(selectorResult);
});

router.get("/player/:PlayerID", (req, res) => {
  const { PlayerID } = req.params;
  const state = store.getState();
  const selectorResult = selectPlayerSeat(state, PlayerID);
  if (selectorResult.length == 0) {
    return res.status(404).json({ id: PlayerID, error: "Player not found" });
  } else if (selectorResult.length > 1) {
    return res.status(500).json({
      id: PlayerID,
      error: "Duplicate records found for player seat",
      records: selectorResult,
    });
  }
  return res.json(selectorResult);
});

export default router;
