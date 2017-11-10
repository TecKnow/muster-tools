import { Map, Set } from "immutable";
import chai, { expect } from "chai";
import chaiImmutable from "chai-immutable";

chai.use(chaiImmutable);

export function MergeActions(A, B) {
  /* TODO:  Investigate using MergeDeepWith to handle this.
     If ever a nested hierarchy of events is desired, more sophisticated
     matching will be required.
  */ 

  const A_MAP = Map(A);
  const B_MAP = Map(B);

  const A_KEYS = Set.fromKeys(A_MAP);
  const B_KEYS = Set.fromKeys(B_MAP);
  const KEYS_INTERSECTION = A_KEYS.intersect(B_KEYS);

  const A_VALUES = Set(A_MAP.values());
  const B_VALUES = Set(B_MAP.values());
  const VALUES_INTERSECTION = A_VALUES.intersect(B_VALUES);

  /* eslint-disable no-unused-expressions
	   These are idiomatic chai BDD assertions
	*/
  expect(KEYS_INTERSECTION).to.be.empty;
  expect(VALUES_INTERSECTION).to.be.empty;
  /* eslint-enable no-unusued-expressions */

  return A_MAP.mergeDeep(B_MAP);
}

export default MergeActions;
