import chai, { expect } from "chai";
import chaiImmutable from "chai-immutable";
import * as actions from "./index.js";

chai.use(chaiImmutable);

test("Contains merged events.", () => {
  expect(actions).to.deep.equal({
    ADD_KNOWN_PLAYER: "ADD_KNOWN_PLAYER",
    REMOVE_KNOWN_PLAYER: "REMOVE_KNOWN_PLAYER",
    UPDATE_KNOWN_PLAYER: "UPDATE_KNOWN_PLAYER",
    CLEAR_KNOWN_PLAYERS_ERROR: "CLEAR_KNOWN_PLAYERS_ERROR"
  });
});
