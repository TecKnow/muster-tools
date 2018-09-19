import { Map, Set } from "immutable";
import ErrorRecord from "../../FSA/error-record";
import {
  PlayerRecordAlice,
  PlayerRecordAliceUpdated,
  PlayerRecordBobDuplicateDCI
} from "./test-players";
//TODO:  Unify the data format between Add and Update errors.
export const AddBobDuplicateDCIErrorRecord = new ErrorRecord({
  errorType: "Duplicate DCI Number",
  UUID: "00000000-0000-0000-0001-000000000000",
  data: Set([
    PlayerRecordBobDuplicateDCI,
    Map({ [PlayerRecordAlice.UUID]: PlayerRecordAlice })
  ])
});
export const UpdateBobDuplicateDCINumberErrorRecord = new ErrorRecord({
  errorType: "Target DCINumber already in use",
  UUID: "00000000-0000-0000-0001-000000000001",
  data: PlayerRecordBobDuplicateDCI.DCINumber
});
export const UpdateAliceNoSuchPlayerErrorRecord = new ErrorRecord({
  errorType: "No Such Player",
  UUID: "00000000-0000-0000-0001-000000000001",
  data: PlayerRecordAliceUpdated.UUID
});
