import { Record } from "immutable";

export const ErrorRecord = Record(
  {
    UUID: null,
    time: null,
    errorType: null,
    message: null,
    data: null
  },
  "ErrorRecord"
);

export default ErrorRecord;
