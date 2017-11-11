import { fromJS, Set, Map } from "immutable";
import chai, { expect } from "chai";
import chaiImmutable from "chai-immutable";
import { testIsFSAError, testFSAError } from "./test-FSA";

chai.use(chaiImmutable);

export function testIsErrorRecord(possibleErrorRecord) {
  const TEST_RECORD = fromJS(possibleErrorRecord);
  expect(TEST_RECORD).to.contain.all.keys("UUID", "time", "errorType");
  /* eslint-disable no-unused-expressions
     These are idiomatic chai BDD assertions
  */
  expect(
    Set(["UUID", "time", "errorType", "message", "data"]).isSuperset(
      Map(TEST_RECORD).keys()
    )
  ).to.be.true;
  /* eslint-enable no-unused-expressions */
}

export function testErrorRecord(
  possibleErrorRecord,
  {
    UUID = undefined,
    time = undefined,
    errorType = undefined,
    message = undefined,
    data = undefined
  }
) {
  const TEST_RECORD = fromJS(possibleErrorRecord);
  testIsErrorRecord(TEST_RECORD);
  if (UUID !== undefined) {
    expect(TEST_RECORD.UUID).to.equal(UUID);
  }
  if (time !== undefined) {
    expect(TEST_RECORD.time).to.equal(time);
  }
  if (errorType !== undefined) {
    expect(TEST_RECORD.errorType).to.equal(errorType);
  }
  if (message !== undefined) {
    expect(TEST_RECORD.message).to.equal(message);
  }
  if (data !== undefined) {
    expect(TEST_RECORD.data).to.equal(data);
  }
}

export function testIsErrorRecordFSA(possibleErrorRecordFSA) {
  const TEST_ACTION = fromJS(possibleErrorRecordFSA);
  testIsFSAError(TEST_ACTION);
  const TEST_RECORD = TEST_ACTION.payload;
  testIsErrorRecord(TEST_RECORD);
}

export function testErrorRecordFSA(
  possibleErrorRecordFSA,
  { type = undefined, meta = undefined },
  {
    UUID = undefined,
    time = undefined,
    errorType = undefined,
    message = undefined,
    data = undefined
  }
) {
  const TEST_EVENT = fromJS(possibleErrorRecordFSA);
  testFSAError(TEST_EVENT, { type, meta });
  const TEST_RECORD = TEST_EVENT.payload;
  testErrorRecord(TEST_RECORD, { UUID, time, errorType, message, data });
}
