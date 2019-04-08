import { fromJS } from "immutable";

export const loadState = () => {
  try {
    const serializedState = localStorage.getItem("state");
    if (serializedState === null) {
      return undefined;
    }
    const deserializedState = fromJS(JSON.parse(serializedState));
    return deserializedState;
  } catch (err) {
    return undefined;
  }
};

export const saveState = state => {
  try {
    const serializedState = JSON.stringify(state.toJSON());
    localStorage.setItem("state", serializedState);
  } catch (err) {
    // Ignore write errors.
  }
};
