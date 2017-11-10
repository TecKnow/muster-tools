import { Map, Set, fromJS } from "immutable";
import chai, { expect } from "chai";
import chaiImmutable from "chai-immutable";

chai.use(chaiImmutable);

export function testIsFSARecord(possibleFSARecord) {
  const TestRecord = fromJS(possibleFSARecord);
  expect(TestRecord).to.have.property("type");
    /* eslint-disable no-unused-expressions
	     These are idiomatic chai BDD assertions
	*/
  expect(
    Set(["type", "error", "meta", "payload"]).isSuperset(Map(TestRecord).keys())
  ).to.be.true;
  // eslint-enable no-unused-expressions
}

export default testIsFSARecord;
