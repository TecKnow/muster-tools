/*  This project uses immutable.js for its action shape.
    Unfortunately, redux.js requires that actions be POJO for some reason.
    To address this, the most straightforward solution is a custom middleware
    which simply converts the immutable.js actions to POJO and starts the
    dispatch process again.

    At the time of this writing immutable.js provides no method that can be
    used to determine if a given object is an immutable object.  Although
    that function is present in the release candidate version.  Therefore this
    middleware simply checks to see if the object is a function, and makes a
    leap of faith to call .toObject() on it in the hopes that a suitable event
    will be the result.

    It is necessary to start the dispatch process over if an even needs to be
    converted, since middleware earlier in the chain won't understand immutable
    events.
*/

export const immutableActionMiddleware = store => next => action => {
  let nextAction = action;
  if (typeof action.toObject === "function") {
    nextAction = action.toObject();
    store.dispatch(nextAction);
  } else {
    next(nextAction);
  }
  return nextAction;
};

export default immutableActionMiddleware;
