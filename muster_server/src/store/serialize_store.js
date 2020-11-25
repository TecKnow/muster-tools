import fs from "fs";
import path from "path";
import { throttle } from "lodash";
import { application_root_path } from "../express-app";

export const default_save_location = path.join(
  application_root_path,
  "muster_server/data/store_data.json"
);

// By default, don't write the store to disk more than once every 10 seconds.
const default_throttle_time = 10000;

export const store_writer = (
  save_file_location = default_save_location,
  wait = default_throttle_time,
  { leading = true, trailing = true } = {}
) => (store) => {
  const store_watcher = async () => {
    return await fs.promises.writeFile(
      save_file_location,
      JSON.stringify(store.getState())
    );
  };

  const throttled_store_watcher = throttle(store_watcher, wait, {
    leading,
    trailing,
  });
  const unsubscribe = store.subscribe(throttled_store_watcher);
  return {
    unsubscribe,
    throttled_writer_fn: throttled_store_watcher,
    writer_fn: store_watcher,
  };
};

export const store_reader = (read_file_location = default_save_location) => {
  let data;
  try {
    data = fs.readFileSync(read_file_location, {
      encoding: "utf-8",
    });
    data = JSON.parse(data);
  } catch (e) {
    data = undefined;
  }
  return data;
};
