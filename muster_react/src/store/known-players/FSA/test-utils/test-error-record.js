import { fromJS, Set, Map } from "immutable";
import chai, { expect } from "chai";
import chaiImmutable from "chai-immutable";

chai.use(chaiImmutable);

export function testIsErrorRecord(possibleErrorRecord) {
  const TestRecord = fromJS(possibleErrorRecord);
  expect(TestRecord).to.contain.all.keys("UUID", "time", "errorType");
  Set(["UUID", "time", "errorType", "message", "data"]).isSuperset(
    Map(TestRecord).keys()
  );
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
  const TestRecord = fromJS(possibleErrorRecord);
  testIsErrorRecord(TestRecord);
  if (UUID !== undefined) {
    expect(TestRecord.UUID).to.equal(UUID);
  }
  if (time !== undefined) {
    expect(TestRecord.time).to.equal(time);
  }
  if (errorType !== undefined) {
    expect(TestRecord.errorType).to.equal(errorType);
  }
  if (message !== undefined) {
    expect(TestRecord.message).to.equal(message);
  }
  if (data !== undefined) {
    expect(TestRecord.data).to.equal(data);
  }
}
export default testErrorRecord;
