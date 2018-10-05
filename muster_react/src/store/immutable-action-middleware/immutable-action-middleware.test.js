import chai, { expect } from "chai";
import chaiImmutable from "chai-immutable";
import immutableActionMiddleware from "./immutable-action-middleware";

import { AddAliceAction } from "../known-players/test/test-actions";

chai.use(chaiImmutable);

describe("Immutable action middleware", () => {
  const store = jest.fn();
  const next = jest.fn();
  store.dispatch = jest.fn();
  const immutableAction = AddAliceAction;
  const POJOAction = AddAliceAction.toObject();

  beforeEach(() => {
    store.mockClear();
    next.mockClear();
    store.dispatch.mockClear();
  });
  test("Immutable action", () => {
    /* An immutable action should trigger the middleware.
  	   the action should be converted to a POJO and dispatched.
  	   next should not be called.
  	*/
    const result = immutableActionMiddleware(store)(next)(immutableAction);
    expect(result).to.deep.equal(POJOAction);
    expect(next.mock.calls.length).to.equal(0);
    expect(store.dispatch.mock.calls.length).to.equal(1);
    expect(store.dispatch.mock.calls[0][0]).to.be.deep.equal(POJOAction);
  });
  test("POJO action", () => {
    /* A POJO action should not trigger the middleware.
  	   the action should be passed to next.
  	   Dispatch should not be called.
  	*/
    const result = immutableActionMiddleware(store)(next)(POJOAction);
    expect(result).to.deep.equal(POJOAction);
    expect(next.mock.calls.length).to.equal(1);
    expect(store.dispatch.mock.calls.length).to.equal(0);
    expect(next.mock.calls[0][0]).to.be.deep.equal(POJOAction);
  });
  test("Thunk action", () => {
    /* A thunk should not trigger the middleware.
  	   The action should be passed to next.
  	   Dispatch should not be called.
  	*/
    const thunkAction = () => true;
    const result = immutableActionMiddleware(store)(next)(thunkAction);
    expect(result).to.equal(thunkAction);
    expect(store.dispatch.mock.calls.length).to.equal(0);
    expect(next.mock.calls.length).to.equal(1);
    expect(next.mock.calls[0][0]).to.equal(thunkAction);
  });
  test("Promise action", () => {
    /* A thunk action should not trigger the middleware.
  	   The actions hould be passed to next.
  	   Dispatch should not be called.
  	*/
    const promiseAction = Promise.resolve(true);
    const result = immutableActionMiddleware(store)(next)(promiseAction);
    expect(result).to.equal(promiseAction);
    expect(store.dispatch.mock.calls.length).to.equal(0);
    expect(next.mock.calls.length).to.equal(1);
    expect(next.mock.calls[0][0]).to.equal(promiseAction);
    return promiseAction;
  });
});
