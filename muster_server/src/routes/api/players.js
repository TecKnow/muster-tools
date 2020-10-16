import { Router } from "express";
import store from "../../store";
import { selectAllPlayers, addPlayer, removePlayer } from "../../store/features/playersSlice";

const router = Router();

const getPlayersJSON = () =>{
  const state = store.getState();
  const players = selectAllPlayers(state);
  const players_json = JSON.stringify(players);
  return players_json;
}

router.get("/", (req, res) => {
  res.send(getPlayersJSON());
});

router.post("/", (req, res) => {
  const { name } = req.body;
  if (!name) {
    return res.status(400).send("Name is required.");
  }
  const action = addPlayer(name);
  store.dispatch(action);
  res.send(getPlayersJSON());
});

router.delete("/:name", (req, res) => {
  const {name} = req.params;
  const action = removePlayer(name);
  store.dispatch(action);
  res.send(getPlayersJSON());
  
});

export default router;
