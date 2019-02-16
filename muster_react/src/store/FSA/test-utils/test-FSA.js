import { Map, Set, fromJS } from "immutable";
import chai, { expect } from "chai";
import chaiImmutable from "chai-immutable";

chai.use(chaiImmutable);

export function testIsFSARecord(possibleFSARecord) {
  const TEST_RECORD = fromJS(possibleFSARecord);
  expect(TEST_RECORD).to.have.property("type");
  /* eslint-disable no-unused-expressions */
  expect(
    Set(["type", "error", "meta", "payload"]).isSuperset(
      Map(TEST_RECORD).keys()
    )
  ).to.be.true;
  // eslint-enable no-unused-expressions
}

export function testFSARecord(
  possibleFSARecord,
  { type = undefined, error = undefined, meta = undefined, payload = undefined }
) {
  const TEST_RECORD = fromJS(possibleFSARecord);
  testIsFSARecord(TEST_RECORD);
  if (type) {
    expect(TEST_RECORD.type).to.be.equal(type);
  }
  if (error) {
    expect(TEST_RECORD.error).to.be.equal(error);
  }
  if (meta) {
    expect(TEST_RECORD.meta).to.be.equal(meta);
  }
  if (payload) {
    expect(TEST_RECORD.payload).to.be.equal(payload);
  }
}

export function testIsFSAError(possibleErrorFSA) {
  const TEST_RECORD = fromJS(possibleErrorFSA);
  testIsFSARecord(TEST_RECORD);
  expect(TEST_RECORD).to.have.property("error", true);
}

export function testFSAError(
  possibleErrorFSA,
  { type = undefined, meta = undefined, payload = undefined }
) {
  const TEST_RECORD = fromJS(possibleErrorFSA);
  testIsFSAError(TEST_RECORD);
  testFSARecord(TEST_RECORD, { error: true, type, meta, payload });
}
