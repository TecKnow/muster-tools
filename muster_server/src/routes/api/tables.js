import { Router } from "express";
import storePromise from "../../store";
import { selectTableSeats } from "../../store/features/seatsSlice";
import {
  createTable,
  removeTable,
  selectTableById,
  selectTableIds,
} from "../../store/features/tablesSlice";

const router = Router();

const getTables = async () => {
  const store = await storePromise;
  const state = store.getState();
  const tables = selectTableIds(state);
  return tables;
};

router.get("/", async (req, res) => {
  return res.json(await getTables());
});

router.post("/", async (req, res) => {
  const action = createTable();
  const store = await storePromise;
  const state = store.getState();
  // This does not selelect the table ID
  // Rather it predicts it, since the store
  // state is not reliably updated immediately after
  // dispatching an action.
  const table_id = Math.max(...selectTableIds(state)) + 1;
  store.dispatch(action);
  return res.status(201).json({ id: table_id });
});

router.get("/:id", async (req, res) => {
  const { id } = req.params;
  const store = await storePromise;
  const state = store.getState();
  const selector_result = selectTableSeats(state, id);
  if (selector_result.length == 0) {
    return res.status(404).json({ id, error: "Table not found" });
  }
  return res.json(selector_result);
});

router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  if (id == 0) {
    return res.status(405).json({ id, error: "Default table cannot be deleted." });
  }
  const store = await storePromise;
  const state = store.getState();
  const selector_result = selectTableById(state, id);
  if (selector_result.length == 0) {
    return res.status(404).json({ id, error: "Table does not exist" });
  }
  //TODO: What if there is more than one result?
  const action = removeTable(id);
  store.dispatch(action);
  return res.json(await getTables());
});

export default router;
