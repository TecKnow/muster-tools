import { Router } from "express";
import storePromise from "../../store";
import {
  selectAllPlayers,
  addPlayer,
  removePlayer,
} from "../../store/features/playersSlice";

const router = Router();

const getPlayersJSON = async () => {
  const store = await storePromise;
  const state = store.getState();
  const players = selectAllPlayers(state);
  const players_json = JSON.stringify(players);
  return players_json;
};

router.get("/", async (req, res) => {
  res.send(await getPlayersJSON());
});

router.post("/", async (req, res) => {
  const { name } = req.body;
  if (!name) {
    return res.status(400).send("Name is required.");
  }
  const store = await storePromise;
  const action = addPlayer(name);
  store.dispatch(action);
  res.send(await getPlayersJSON());
});

router.delete("/:name", async (req, res) => {
  const { name } = req.params;
  const action = removePlayer(name);
  const store = await storePromise;
  store.dispatch(action);
  res.send(await getPlayersJSON());
});

export default router;
