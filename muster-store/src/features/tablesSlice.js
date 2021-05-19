import {
  createSlice,
  createEntityAdapter,
  createAsyncThunk,
} from "@reduxjs/toolkit";

const tablesAdapter = createEntityAdapter({
  sortComparer: (a, b) => (a < b ? -1 : a > b ? 1 : 0),
});

export const fetchTables = createAsyncThunk(
  "tables/fetchTables",
  async (_, thunkApi) => {
    try {
      api = thunkApi.extra;
      const dataFromServer = await api.selectAllTables();
      const result = Array.prototype.map.call(dataFromServer, (tableRow) => ({
        id: tableRow.Identifier,
      }));
      return result;
    } catch (err) {
      thunkApi.rejectWithValue(err);
    }
  }
);

export const tablesSlice = createSlice({
  name: "tables",
  initialState: tablesAdapter.getInitialState({
    ids: [0],
    entities: { 0: { id: 0 } },
  }),
  reducers: {
    createTable: {
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
  },
});

export const { createTable, removeTable } = tablesSlice.actions;

export const {
  selectAll: selectAllTables,
  selectById: selectTableById,
  selectIds: selectTableIds,
} = tablesAdapter.getSelectors((state) => state.tables);

export default tablesSlice.reducer;
