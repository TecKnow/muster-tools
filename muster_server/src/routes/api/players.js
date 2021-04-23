import { Router } from "express";
import store from "../../store";
import {addPlayer, removePlayer, selectPlayerById, selectPlayerIds} from "muster_store";

const router = Router();

const getPlayers = () => {
  const state = store.getState();
  const players = selectPlayerIds(state);
  return players;
};

router.get("/", (req, res) => {
  return res.json(getPlayers());
});

router.post("/", (req, res) => {
  const { name } = req.body;
  if (!name) {
    return res.status(400).json({ error: "Name is required." });
  }
  const selectorResult = selectPlayerById(store.getState(), name);
  if (selectorResult) {
    return res
      .status(409)
      .json({ id: name, error: "A player with that name already exists." });
  }
  const action = addPlayer(name);
  store.dispatch(action);
  return res.json(getPlayers());
});

router.delete("/:name", (req, res) => {
  const { name } = req.params;
  const state = store.getState();
  const selector_result = selectPlayerById(state, name);
  if (!selector_result) {
    return res.status(404).json({ id: name, error: "Player not found." });
  }
  const action = removePlayer(name);
  store.dispatch(action);
  return res.json(getPlayers());
});

export default router;
