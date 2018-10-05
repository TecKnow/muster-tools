import { Map } from "immutable";
import chai, { expect } from "chai";
import chaiImmutable from "chai-immutable";
import { PlayerRecordBob } from "../test/test-players";
import { KnownPlayersEmpty, KnownPlayersTwo } from "../test/test-stores";
import {
  getPlayers,
  getPlayersByUUID,
  getPlayersByName,
  getPlayersByDCINumber,
  getPlayersWithName,
  getPlayersWithDCINumber,
  getPlayerWithUUID
} from "./index";

chai.use(chaiImmutable);

const TEST_STORE_TWO = KnownPlayersTwo;
const TEST_STORE_EMPTY = KnownPlayersEmpty;

//TODO: Deduplicate this code.
describe("known players index selectors", () => {
  describe("getPlayers", () => {
    test("Two known players", () => {
      const TEST_VALUE = getPlayers(TEST_STORE_TWO);
      expect(TEST_VALUE).to.equal(
        TEST_STORE_TWO.get("KnownPlayersIndex").toSet()
      );
    });
    test("No known players", () => {
      const TEST_VALUE = getPlayers(TEST_STORE_EMPTY);
      expect(TEST_VALUE).to.equal(
        TEST_STORE_EMPTY.get("KnownPlayersIndex").toSet()
      );
    });
  });
  describe("getPlayersByUUID", () => {
    test("Two known players", () => {
      const TEST_VALUE = getPlayersByUUID(TEST_STORE_TWO);
      expect(TEST_VALUE).to.equal(TEST_STORE_TWO.get("KnownPlayersIndex"));
    });
    test("No known players", () => {
      const TEST_VALUE = getPlayersByUUID(TEST_STORE_EMPTY);
      expect(TEST_VALUE).to.equal(TEST_STORE_EMPTY.get("KnownPlayersIndex"));
    });
  });
  describe("getPlayersByName", () => {
    test("Two known players", () => {
      const TEST_VALUE = getPlayersByName(TEST_STORE_TWO);
      expect(TEST_VALUE).to.equal(
        TEST_STORE_TWO.get("KnownPlayersIndex").groupBy(V => V.name)
      );
    });
    test("No known players", () => {
      const TEST_VALUE = getPlayersByName(TEST_STORE_EMPTY);
      expect(TEST_VALUE).to.equal(
        TEST_STORE_EMPTY.get("KnownPlayersIndex").groupBy(V => V.name)
      );
    });
  });
  describe("getPlayersByDCINumber", () => {
    test("Two known players", () => {
      const TEST_VALUE = getPlayersByDCINumber(TEST_STORE_TWO);
      expect(TEST_VALUE).to.equal(
        TEST_STORE_TWO.get("KnownPlayersIndex").groupBy(V => V.DCINumber)
      );
    });
    test("No known players", () => {
      const TEST_VALUE = getPlayersByDCINumber(TEST_STORE_EMPTY);
      expect(TEST_VALUE).to.equal(
        TEST_STORE_EMPTY.get("KnownPlayersIndex").groupBy(V => V.DCINumber)
      );
    });
  });
  describe("GetPlayersWithName", () => {
    describe("Two known players", () => {
      test("Name found", () => {
        const TEST_VALUE = getPlayersWithName(
          TEST_STORE_TWO,
          PlayerRecordBob.name
        );
        expect(TEST_VALUE).to.equal(
          Map({ [PlayerRecordBob.UUID]: PlayerRecordBob })
        );
      });
      test("Name not found", () => {
        const TEST_VALUE = getPlayersWithName(TEST_STORE_TWO, "Malory");
        expect(TEST_VALUE).to.equal(undefined);
      });
      const TEST_VALUE = getPlayersWithName(TEST_STORE_TWO, "Malory");
      expect(TEST_VALUE).to.equal(undefined);
    });
    test("No known players", () => {
      const TEST_VALUE = getPlayersWithName(TEST_STORE_EMPTY, "Malory");
      expect(TEST_VALUE).to.equal(undefined);
    });
  });

  describe("getPlayerWithUUID", () => {
    describe("Two known players", () => {
      test("UUID found", () => {
        const TEST_VALUE = getPlayerWithUUID(
          TEST_STORE_TWO,
          PlayerRecordBob.UUID
        );
        expect(TEST_VALUE).to.equal(PlayerRecordBob);
      });
      test("UUID not found", () => {
        const TEST_VALUE = getPlayerWithUUID(
          TEST_STORE_TWO,
          "00000000-0000-0000-0000-999999999999"
        );
        expect(TEST_VALUE).to.equal(undefined);
      });
      const TEST_VALUE = getPlayerWithUUID(
        TEST_STORE_TWO,
        "00000000-0000-0000-0000-999999999999"
      );
      expect(TEST_VALUE).to.equal(undefined);
    });
    test("No known players", () => {
      const TEST_VALUE = getPlayerWithUUID(
        TEST_STORE_EMPTY,
        "00000000-0000-0000-0000-999999999999"
      );
      expect(TEST_VALUE).to.equal(undefined);
    });
  });

  describe("getPlayersWithDCINumber", () => {
    describe("Two known players", () => {
      test("DCINumber found", () => {
        const TEST_VALUE = getPlayersWithDCINumber(
          TEST_STORE_TWO,
          PlayerRecordBob.DCINumber
        );
        expect(TEST_VALUE).to.equal(
          Map({ [PlayerRecordBob.UUID]: PlayerRecordBob })
        );
      });
      test("DCINumber not found", () => {
        const TEST_VALUE = getPlayersWithDCINumber(
          TEST_STORE_TWO,
          "9999999999"
        );
        expect(TEST_VALUE).to.equal(undefined);
      });
      const TEST_VALUE = getPlayersWithDCINumber(TEST_STORE_TWO, "9999999999");
      expect(TEST_VALUE).to.equal(undefined);
    });
    test("No known players", () => {
      const TEST_VALUE = getPlayersWithDCINumber(
        TEST_STORE_EMPTY,
        "9999999999"
      );
      expect(TEST_VALUE).to.equal(undefined);
    });
  });
});
