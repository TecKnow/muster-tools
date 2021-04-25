import fs from "fs";
import { file } from "tmp-promise";
import { _makeStore } from "../index";
import { store_reader, store_writer } from "../serialize_store";

test("Serialize intial state", async () => {
  const { fd, path, cleanup } = await file({ keep: true });
  fs.closeSync(fd);
  const test_store = _makeStore(undefined);
  const { throttled_writer_fn } = store_writer(path)(test_store);
  const initialState = test_store.getState();
  await throttled_writer_fn();
  const read_state = store_reader(path);
  expect(read_state).toEqual(initialState);
  throttled_writer_fn.cancel();
  cleanup();
});

test("bad file produces initial state", async () => {
  const { fd, path, cleanup } = await file({ keep: true });
  fs.closeSync(fd);
  await fs.promises.writeFile(path, "This isn't JSON at all.");
  const initial_state = _makeStore(undefined).getState();
  const test_state = _makeStore(store_reader(path)).getState();
  expect(test_state).toEqual(initial_state);
  cleanup();
});
