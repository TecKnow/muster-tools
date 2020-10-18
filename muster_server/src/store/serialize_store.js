import fs from "fs";
import path from "path";
import { throttle } from "lodash";
import { application_root_path } from "../express-app";

// By default, don't write the store to disk more than once every 10 seconds.

export const default_save_location = path.join(
  application_root_path,
  "/data/store_data.json"
);
const default_throttle_time = 10000;

export const store_writer = (
  save_file_location = default_save_location,
  wait = default_throttle_time,
  { leading = true, trailing = true } = {}
) => async (storePromise) => {
  const store = await storePromise;
  const store_watcher = async () => {
    await fs.promises.writeFile(
      save_file_location,
      JSON.stringify(store.getState())
    );
  };

  const throttled_store_watcher = throttle(store_watcher, wait, {
    leading,
    trailing,
  });
  const { cancel, flush } = throttled_store_watcher;
  const unsubscribe = store.subscribe(throttled_store_watcher);
  return { unsubscribe, cancel, flush };
};

export const store_reader = async (
  read_file_location = default_save_location
) => {
  let data;
  try {
    data = await fs.promises.readFile(default_save_location, {
      encoding: "utf-8",
    });
    data = JSON.parse(data);
  } catch (e) {
    data = undefined;
  }
  return data;
};
