import chai, { AssertionError, expect } from "chai";
import chaiImmutable from "chai-immutable";
import { testIsFSARecord, testIsFSAError } from "./test-utils/test-FSA";
import { FSARecord } from "./fsa-record";

chai.use(chaiImmutable);

describe("FSA record test", () => {
  test("Passing object", () => {
    const test_object = new FSARecord();
    testIsFSARecord(test_object);
  });
  test("Passing object, not immutable", () => {
    /*NOTE:  The testing library doesn't care if objects are immutable or not, and
    the immutable library doesn't provide any easy way to check.

    Be aware that these types of objects WILL PASS many tests, but won't
    work in all cases.*/
    const test_object = { type: null, error: false, payload: null, meta: null };
    testIsFSARecord(test_object);
  });
  test("Failing object, extra keys", () => {
    const test_object = {
      type: null,
      error: false,
      payload: null,
      meta: null,
      KEY_NOT_IN_SPEC: null
    };
    expect(() => testIsFSARecord(test_object)).to.throw(AssertionError);
  });
  test("Failing object, missing keys", () => {
    const test_object = { error: null, meta: null, payload: null };
    expect(() => testIsFSARecord(test_object)).to.throw(AssertionError);
  });
});

describe("FSA error record test", () => {
  test("Passing error FSA", () => {
    const test_object = new FSARecord({ type: null, error: true });
    testIsFSAError(test_object);
  });
  test("Failing non-error FSA", () => {
    const test_object = new FSARecord({ type: null, error: false });
    expect(() => testIsFSAError(test_object)).to.throw(AssertionError);
  });
  test("Failing non-FSA error", () => {
    const test_object = { error: true };
    expect(() => testIsFSAError(test_object)).to.throw(AssertionError);
  });
});
