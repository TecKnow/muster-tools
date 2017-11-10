import {fromJS} from 'immutable';
import chai, {expect } from "chai";
import chaiImmutable from "chai-immutable";
import testIsFSARecord from './test-FSA';

chai.use(chaiImmutable);

export function testIsFSAError(possibleErrorFSA) {
  const TestRecord = fromJS(possibleErrorFSA);
  testIsFSARecord(TestRecord);
  expect(TestRecord).to.have.property("error", true);
}

export function testFSAError(possibleErrorFSARecord, {type = undefined, meta = undefined, payload = undefined}){
	const TEST_RECORD = fromJS(possibleErrorFSARecord)
	testIsFSAError(TEST_RECORD);
	if(type !== undefined){
		expect(TEST_RECORD.type).to.equal(type);
	}
	if(meta !== undefined){
		expect(TEST_RECORD.meta).to.equal(meta);
	}
	if(payload !== undefined){
		expect(TEST_RECORD.payload).to.equal(payload);
	}
}

export default testIsFSAError;