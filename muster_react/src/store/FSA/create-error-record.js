import uuidv4 from "uuid/v4";
import ErrorRecord from "./error-record";
import FSARecord from "./fsa-record";

export function CreateErrorRecord({
  errorType,
  message,
  data,
  UUID = undefined,
  time = undefined
}) {
  const new_error_record = new ErrorRecord({
    UUID: UUID || uuidv4(),
    time: time || Date(),
    errorType,
    message,
    data
  });
  return new_error_record;
}

export function CreateErrorEvent({
  type,
  errorType,
  message,
  data,
  UUID = undefined,
  time = undefined
}) {
  const new_error_event = new FSARecord({
    type,
    error: true,
    payload: CreateErrorRecord({
      errorType,
      message,
      data,
      UUID,
      time
    })
  });
  return new_error_event;
}

export default CreateErrorEvent;
