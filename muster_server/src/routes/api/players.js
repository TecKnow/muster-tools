import { Router } from "express";
import storePromise from "../../store";
import {
  addPlayer,
  removePlayer,
  selectPlayerById,
  selectPlayerIds
} from "../../store/features/playersSlice";

const router = Router();

const getPlayers = async () => {
  const store = await storePromise;
  const state = store.getState();
  const players = selectPlayerIds(state);
  return players;
};

router.get("/", async (req, res) => {
  return res.json(await getPlayers());
});

router.post("/", async (req, res) => {
  const { name } = req.body;
  if (!name) {
    return res.status(400).send("Name is required.");
  }
  const store = await storePromise;
  const selectorResult = selectPlayerById(store.getState(), name);
  if(selectorResult){
    return res.status(409).json({id: name, error: "A player with that name already exists."});
  }
  const action = addPlayer(name);
  store.dispatch(action);
  return res.json(await getPlayers());
});

router.delete("/:name", async (req, res) => {
  const { name } = req.params;
  const action = removePlayer(name);
  const store = await storePromise;
  store.dispatch(action);
  res.json(await getPlayers());
});

export default router;
