import { Map } from "immutable";
import chai, { AssertionError, expect } from "chai";
import chaiImmutable from "chai-immutable";
import { MergeActions } from "./action-merge";

chai.use(chaiImmutable);

test("Valid merge", () => {
  const A = Map({ a: "one" });
  const B = Map({ b: "two" });
  const expected_result = Map({ a: "one", b: "two" });
  const test_result = MergeActions(A, B);
  expect(test_result).to.equal(expected_result);
});
test("Key conflict", () => {
  const A = Map({ a: "one" });
  const B = Map({ a: "two" });
  expect(()=>MergeActions(A,B)).to.throw(AssertionError);
});
test("Value conflict", () => {
	const A = Map({ a: "one" });
  const B = Map({ b: "one" });
  expect(()=>MergeActions(A,B)).to.throw(AssertionError);
});
test("Key and Value conflict", () => {
  const A = Map({ a: "one", c: "three", });
  const B = Map({ a: "one", d: "four" });
  expect(()=>MergeActions(A,B)).to.throw(AssertionError);
});
