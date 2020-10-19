import {Router} from "express";
import storePromise from "../../store";
import {createTable, removeTable, selectTableById, selectTableIds} from "../../store/features/tablesSlice";

const router = Router();

const getTables = async () =>{
  const store = await storePromise;
  const state = store.getState();
  const tables = selectTableIds(state);
  return tables;
}

router.get("/", async (req,res) => {
  return res.json(await getTables());
});

router.post("/", async (req, res) =>{
  const action = createTable();
  const store = await storePromise;
  const state = store.getState();
  const table_id = Math.max(...selectTableIds(state))+1;
  store.dispatch(action);
  return res.status(201).json({id: table_id});
  
});

router.delete("/:id", async (req,res)=>{
  const {id} = req.params;
  const store = await storePromise;
  const state = store.getState()
  const selector_result = selectTableById(state, id);
  if(!selector_result){
    return res.status(404).json({id, error: "Table does not exist"});
  }
  const action = removeTable(id);
  store.dispatch(action);
  res.json(await(getTables()));
});

export default router;