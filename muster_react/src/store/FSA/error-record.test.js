import chai, { AssertionError, expect } from "chai";
import chaiImmutable from "chai-immutable";
import { FSARecord } from "./fsa-record";
import ErrorRecord from "./error-record";
import {
  testIsErrorRecord,
  testIsErrorRecordFSA
} from "./test-utils/test-error-record.js";

chai.use(chaiImmutable);

describe("Error record test", () => {
  test("Passing object", () => {
    const TEST_RECORD = new ErrorRecord({});
    testIsErrorRecord(TEST_RECORD);
  });
  test("Passing object, not immutable", () => {
    const TEST_RECORD = {
      UUID: null,
      time: null,
      errorType: null,
      message: null,
      data: null
    };
    testIsErrorRecord(TEST_RECORD);
  });
  test("Failing object, extra keys", () => {
    const TEST_RECORD = {
      UUID: null,
      time: null,
      errorType: null,
      message: null,
      data: null,
      KEY_NOT_IN_SPEC: null
    };
    expect(() => testIsErrorRecord(TEST_RECORD)).to.throw(AssertionError);
  });
  test("Failing object, missing keys", () => {
    const TEST_RECORD = {
      UUID: null,
      time: null,
      message: null,
      data: null
    };
    expect(() => testIsErrorRecord(TEST_RECORD)).to.throw(AssertionError);
  });
});

describe("Error action test", () => {
  test("Passing action", () => {
    const TEST_ACTION = new FSARecord({
      error: true,
      payload: new ErrorRecord({})
    });
    testIsErrorRecordFSA(TEST_ACTION);
  });
  test("failing non-error action", () => {
    const TEST_ACTION = new FSARecord({ payload: new ErrorRecord({}) });
    expect(() => testIsErrorRecordFSA(TEST_ACTION)).to.throw(AssertionError);
  });
  test("failing bad-payload error action", () => {
    const TEST_ACTION = new FSARecord({ payload: false });
    expect(() => testIsErrorRecordFSA(TEST_ACTION)).to.throw(AssertionError);
  });
});
