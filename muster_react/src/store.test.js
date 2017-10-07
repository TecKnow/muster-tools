import { isFSA, isError } from "flux-standard-action";
import { Map } from "immutable";
import {
	PlayerRecord,
	knownPlayersActionCreators,
	knownPlayersIndexReducers
} from "./store";

const PlayerRecordAlice = new PlayerRecord({
	name: "Alice",
	DCINumber: "0000000000",
	UUID: "00000000-0000-0000-0000-000000000000"
});
const PlayerRecordBob = new PlayerRecord({
	name: "Bob",
	DCINumber: "0000000001",
	UUID: "00000000-0000-0000-0000-000000000001"
});
const PlayerRecordBobDuplicateDCI = new PlayerRecord({
	name: "Bob",
	DCINumber: "0000000000",
	UUID: "00000000-0000-0000-0000-000000000001"
});
const PlayerRecordBobDuplicateUUID = new PlayerRecord({
	name: "Bob",
	DCINumber: "0000000001",
	UUID: "00000000-0000-0000-0000-000000000000"
});
const KnownPlayersEmpty = Map({
	KNOWN_PLAYER_INDEX: Map(),
	KNOWN_PLAYER_ERRORS: Map()
});
const KnownPlayersOne = Map({
	KNOWN_PLAYER_INDEX: Map([[PlayerRecordAlice.UUID, PlayerRecordAlice]]),
	KNOWN_PLAYER_ERRORS: Map()
});
const KnownPlayersTwo = Map({
	KNOWN_PLAYER_INDEX: Map([
		[PlayerRecordAlice.UUID, PlayerRecordAlice],
		[PlayerRecordBob.UUID, PlayerRecordBob]
	]),
	KNOWN_PLAYER_ERRORS: Map()
});
const AddAliceAction = {
	type: "KNOWN_PLAYERS/ADD",
	payload: PlayerRecordAlice
};
const AddBobAction = {
	type: "KNOWN_PLAYERS/ADD",
	payload: PlayerRecordBob
};
const AddBobDuplicateDCIAction = {
	type: "KNOWN_PLAYERS/ADD",
	payload: PlayerRecordBobDuplicateDCI
};
const AddBobDuplicateUUIDAction = {
	type: "KNOWN_PLAYERS/ADD",
	payload: PlayerRecordBobDuplicateUUID
};

describe("Known Players", () => {
	describe("Action creators", () => {
		describe("ADD", () => {
			test("Creates expected event", () => {
				const testValue = knownPlayersActionCreators.knownPlayers.add(
					PlayerRecordAlice.name,
					PlayerRecordAlice.DCINumber,
					PlayerRecordAlice.UUID
				);
				expect(testValue).toEqual(AddAliceAction);
			});
		});
		describe.skip("UPDATE", () => {}); // TODO: Implement when useful
		describe.skip("REMOVE", () => {}); // TODO: Implement when useful
		describe("CLEAR_ERROR", () => {
			test("Creates expected event", ()=> {
				const testValue = knownPlayersActionCreators.knownPlayers.clearError()
			});
		}); // TODO: Implement
	});
	describe("Reducers", () => {
		describe("ADD", () => {
			describe("Normal Operation", () => {
				test("Adds first player", () => {
					const testValue = knownPlayersIndexReducers(
						KnownPlayersEmpty,
						AddAliceAction
					);
					expect(testValue).toEqual(KnownPlayersOne);
				});
				test("Adds second player", () => {
					const testValue = knownPlayersIndexReducers(
						KnownPlayersOne,
						AddBobAction
					);
					expect(testValue).toEqual(KnownPlayersTwo);
				});
			});
			describe("Exceptional Operation", () => {
				test("Duplicate DCINumber", () => {
					const testState = knownPlayersIndexReducers(
						KnownPlayersOne,
						AddBobDuplicateDCIAction
					);
					expect(testState.KNOWN_PLAYER_INDEX).toEqual(
						KnownPlayersOne.KNOWN_PLAYER_INDEX
					);
					expect(
						testState.hasIn(["KNOWN_PLAYER_ERRORS", "DuplicateDCIErrorRecord"])
					).toBe(true);
					expect(
						testState.getIn(["KNOWN_PLAYER_ERRORS", "DuplicateDCIErrorRecord"])
							.size
					).toBe(1);
					const testError = testState
						.getIn(["KNOWN_PLAYER_ERRORS", "DuplicateDCIErrorRecord"])
						.first();

					expect(testError.errorType).toEqual("DuplicateDCIErrorRecord");
					expect(testError.actionType).toEqual(AddBobDuplicateDCIAction.type);
					expect(testError.existingObject).toEqual(PlayerRecordAlice);
					expect(testError.newObject).toEqual(PlayerRecordBobDuplicateDCI);
				});
				test("Duplicate UUID", () => {
					const testState = knownPlayersIndexReducers(
						KnownPlayersOne,
						AddBobDuplicateUUIDAction
					);
					expect(testState.KNOWN_PLAYER_INDEX).toEqual(
						KnownPlayersOne.KNOWN_PLAYER_INDEX
					);
					expect(
						testState.hasIn(["KNOWN_PLAYER_ERRORS", "DuplicateUUIDErrorRecord"])
					).toBe(true);
					expect(
						testState.getIn(["KNOWN_PLAYER_ERRORS", "DuplicateUUIDErrorRecord"])
							.size
					).toBe(1);
					const testError = testState
						.getIn(["KNOWN_PLAYER_ERRORS", "DuplicateUUIDErrorRecord"])
						.first();

					expect(testError.errorType).toEqual("DuplicateUUIDErrorRecord");
					expect(testError.actionType).toEqual(AddBobDuplicateUUIDAction.type);
					expect(testError.existingObject).toEqual(PlayerRecordAlice);
					expect(testError.newObject).toEqual(PlayerRecordBobDuplicateUUID);
				});
				test.skip("Handles multiple types of errors", () => {}); //TODO
				test.skip("Handles multiple instances of errors", () => {}); //TODO
				test.skip("Duplicate DCI errors take precedence", () => {}); //TODO
			});
		});
	});
});