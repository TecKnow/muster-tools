import { fromJS } from "immutable";
import { testIsFSAError } from "./test-FSA-error";
import { testErrorRecord } from "./test-error-record";

export function testIsFSAErrorRecord(
  possibleFSAErrorRecord,
  {
    UUID = undefined,
    time = undefined,
    errorType = undefined,
    message = undefined,
    data = undefined
  }
) {
  const TEST_RECORD = fromJS(possibleFSAErrorRecord);
  testIsFSAError(TEST_RECORD);
  testErrorRecord(TEST_RECORD.payload, {UUID, time, errorType, message, data});
}
