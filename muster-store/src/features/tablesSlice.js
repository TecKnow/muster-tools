import {
  createSlice,
  createEntityAdapter,
  createAsyncThunk,
} from "@reduxjs/toolkit";
import { systemReset } from "./systemActions";

const tablesAdapter = createEntityAdapter({
  sortComparer: (a, b) => (a < b ? -1 : a > b ? 1 : 0),
});

export const fetchTables = createAsyncThunk(
  "tables/fetchTables",
  async (_, { extra: api }) => {
    const dataFromServer = await api.selectAllTables();
    const result = Array.prototype.map.call(dataFromServer, (tableRow) => ({
      id: tableRow.Identifier,
    }));
    return result;
  }
);

export const deleteTable = createAsyncThunk(
  "tables/deleteTable",
  async ({ TableIdentifier }, { extra: api }) => {
    const dataFromServer = await api.deleteTable(TableIdentifier);
    return;
  }
);

export const createTable = createAsyncThunk(
  "tables/createTable",
  async (_, { extra: api }) => {
    const dataFromServer = await api.addTable();
    return dataFromServer.data;
  }
);

const initialState = tablesAdapter.getInitialState({
  ids: [0],
  entities: { 0: { id: 0 } },
});

export const tablesSlice = createSlice({
  name: "tables",
  initialState,
  reducers: {
    addTable: {
      // TODO: Make sure this calculation for the new table number can't get out of sync with the server's
      reducer: (state, action) => {
        const new_table_number =
          parseInt(action.payload) || Math.max(...state.ids) + 1;
        tablesAdapter.addOne(state, {
          ...action,
          payload: { id: new_table_number },
        });
      },
    },
    removeTable: {
      reducer: (state, action) => {
        if (action.payload != 0) {
          tablesAdapter.removeOne(state, action);
        }
      },
      prepare: (tableId) => {
        const action = { payload: tableId };
        if (tableId == 0) {
          action.error = true;
        }
        return action;
      },
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchTables.fulfilled, tablesAdapter.upsertMany);
    builder.addCase(systemReset, (state, action) => {
      return initialState;
    });
  },
});

export const { addTable, removeTable } = tablesSlice.actions;

export const {
  selectAll: selectAllTables,
  selectById: selectTableById,
  selectIds: selectTableIds,
} = tablesAdapter.getSelectors((state) => state.tables);

export default tablesSlice.reducer;
