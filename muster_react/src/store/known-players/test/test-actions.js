import { Map, Set } from "immutable";
import FSARecord from "../FSA/fsa-record";
import ErrorRecord from "../FSA/error-record";
import actions from "../constants";
import {
  PlayerRecordAlice,
  PlayerRecordBob,
  PlayerRecordBobDuplicateDCI,
  PlayerRecordBobDuplicateUUID,
  PlayerRecordBobDuplicateDCIUUID
} from "./test-players";

export const AddAliceAction = new FSARecord({
  type: actions.get("ADD_KNOWN_PLAYER"),
  payload: PlayerRecordAlice
});
export const AddBobAction = new FSARecord({
  type: actions.get("ADD_KNOWN_PLAYER"),
  payload: PlayerRecordBob
});
export const AddBobDuplicateDCIAction = new FSARecord({
  type: actions.get("ADD_KNOWN_PLAYER"),
  error: true,
  payload: new ErrorRecord({
    errorType: "Duplicate DCI Number",
    data: Set([
      PlayerRecordBobDuplicateDCI,
      Map({ [PlayerRecordAlice.UUID]: PlayerRecordAlice })
    ])
  })
});

export const RemoveAliceAction = new FSARecord({
  type: actions.get("REMOVE_KNOWN_PLAYER"),
  payload: PlayerRecordAlice.UUID
});

export const RemoveBobAction = new FSARecord({
  type: actions.get("REMOVE_KNOWN_PLAYER"),
  payload: PlayerRecordBob.UUID
});

/*  The error generating actions below aren't actually valid.
    The architecture chosen means that the action creators won't create them.

    Perhaps they should be created so a clearer chain from the intended action
    can be shown. But this would mean that the store would need to be made
    smarter to reject these events, and listeners would need to be created to
    generate the errors.
*/

// export const AddBobDuplicateDCIAction = new FSARecord({
// 	type: actions.get("ADD_KNOWN_PLAYER"),
// 	payload: PlayerRecordBobDuplicateDCI
// });
// export const AddBobDuplicateUUIDAction = new FSARecord({
// 	type: actions.get("ADD_KNOWN_PLAYER"),
// 	payload: PlayerRecordBobDuplicateUUID
// });
// export const AddBobDuplicateDCIUUIDAction = new FSARecord({
// 	type: actions.get("ADD_KNOWN_PLAYER"),
// 	payload: PlayerRecordBobDuplicateDCIUUID
// });
