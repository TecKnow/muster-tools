import PlayerRecord from "../player-record";
// WARNING: Please note that the UUIDs used here are not valid UUIDs.
export const PlayerRecordAlice = new PlayerRecord({
  name: "Alice",
  DCINumber: "0000000000",
  UUID: "00000000-0000-0000-0000-000000000000"
});
export const PlayerRecordBob = new PlayerRecord({
  name: "Bob",
  DCINumber: "0000000001",
  UUID: "00000000-0000-0000-0000-000000000001"
});
export const PlayerRecordBobDuplicateDCI = new PlayerRecord({
  name: "Bob",
  DCINumber: "0000000000",
  UUID: "00000000-0000-0000-0000-000000000001"
});
export const PlayerRecordBobDuplicateUUID = new PlayerRecord({
  name: "Bob",
  DCINumber: "0000000001",
  UUID: "00000000-0000-0000-0000-000000000000"
});
export const PlayerRecordBobDuplicateDCIUUID = new PlayerRecord({
  name: "Bob",
  DCINumber: "0000000000",
  UUID: "00000000-0000-0000-0000-000000000000"
});
export const PlayerRecordAliceUpdated = new PlayerRecord({
  name: "Charlie",
  DCINumber: "0000000000",
  UUID: "00000000-0000-0000-0000-000000000000"
});
