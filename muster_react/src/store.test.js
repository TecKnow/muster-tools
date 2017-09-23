import { Map } from "immutable";
import { isFSA, isError } from "flux-standard-action";
import { ADD_KNOWN_PLAYER, PlayerRecord, createKnownPlayer } from "./store";

const PlayerRecordAlice = PlayerRecord({
	name: "Alice",
	DCINumber: "0000000000",
	UUID: "00000000-0000-0000-0000-000000000000"
});
const PlayerRecordBob = PlayerRecord({
	name: "Bob",
	DCINumber: "0000000001",
	UUID: "00000000-0000-0000-0000-000000000001"
});
const KnownPlayersEmpty = Map();
const KnownPlayersOne = Map({
	"00000000-0000-0000-0000-000000000000": PlayerRecordAlice
});

describe("Known Player List", () => {
	describe("Action creators", () => {
		describe("createKnownPlayer", () => {
			describe("Duplicate Entries", () => {
				test("Doesn't allow duplicate DCI Numbers", () => {
					const testValue = createKnownPlayer(
						KnownPlayersOne,
						PlayerRecordBob.name,
						PlayerRecordAlice.DCINumber,
						PlayerRecordBob.UUID
					);
					expect(isFSA(testValue)).toBe(true);
					expect(isError(testValue)).toBe(true);
				});
				test("Handles duplicate UUIDs", () => {
					const testValue = createKnownPlayer(
						KnownPlayersOne,
						PlayerRecordBob.name,
						PlayerRecordBob.DCINumber,
						PlayerRecordAlice.UUID
					);
					expect(isFSA(testValue)).toBe(true);
					expect(isError(testValue)).toBeFalsy();
					expect(testValue).toHaveProperty("type", ADD_KNOWN_PLAYER);
					expect(testValue).toHaveProperty("payload");
					expect(testValue.payload.name).toBe(PlayerRecordBob.name);
					expect(testValue.payload.DCINumber).toBe(
						PlayerRecordBob.DCINumber
					);
					expect(testValue.payload.UUID).toMatch(
						// Copied from Jon Almeida: https://jonalmeida.com/posts/2014/05/20/testing-for-a-correct-uuid/
						/^[0-9a-fA-F]{8}-?[0-9a-fA-F]{4}-?4[0-9a-fA-F]{3}-?[89abAB][0-9a-fA-F]{3}-?[0-9a-fA-F]{12}$/
					);
					expect(testValue.payload.UUID).not.toEqual(
						PlayerRecordAlice.UUID
					);
				});
			});
		});
	});
});
