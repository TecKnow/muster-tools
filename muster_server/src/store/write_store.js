import fs from "fs";
import path from "path";
import { throttle } from "lodash";
import { application_root_path } from "../express-app";

// By default, don't write the store to disk more than once every 10 seconds.

export const default_save_location = path.join(
  application_root_path,
  "/store_data.json"
);
const default_throttle_time = 10000;

export const store_writer = (
  save_file_location = default_save_location,
  wait = default_throttle_time,
  { leading = true, trailing = true } = {}
) => (store) => {
  const store_watcher = () => {
    fs.writeFile(
      save_file_location,
      JSON.stringify(store.getState()),
      (err) => {
        if (err) {
          console.error(err);
          return err;
        }
        console.log("store written to disk successfully");
      }
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

export default store_writer;
