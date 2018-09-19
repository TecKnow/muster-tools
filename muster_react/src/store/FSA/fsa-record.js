import { Record } from "immutable";

export const FSARecord = Record(
  {
    type: null,
    error: false,
    meta: null,
    payload: null
  },
  "FSARecord"
);

export default FSARecord;
