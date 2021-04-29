import { ForeignKeyConstraintError, UniqueConstraintError } from "sequelize";
import {
  sequelize,
  addPlayer,
  removePlayer,
  selectAllPlayers,
  selectPlayerIds,
  createTable,
} from "..";

const playerModel = sequelize.models.Player;
const tableModel = sequelize.models.Table;
const seatModel = sequelize.models.Seat;

const defaultSetup = async () => {
  await addPlayer("Alice");
  await addPlayer("Bob");
  await addPlayer("Charlie");
};

beforeEach(async () => {
  sequelize.drop();
  await sequelize.sync({ force: true });
  await defaultSetup();
});

test("Add player rows", async () => {
  const expected_names = ["Alice", "Bob", "Charlie"];

  const contents = await playerModel.findAll({ attributes: ["Name"] });
  const names_arry = contents.map((row) => row.Name);
  expect(names_arry).toEqual(expect.arrayContaining(expected_names));
});

test("Add duplicate player", async () => {
  const addDuplicatePlayer = async () => {
    return await playerModel.create({ Name: "Alice" });
  };
  await expect(addDuplicatePlayer).rejects.toThrow(UniqueConstraintError);
});

test("Add a seat with an invalid table", async () => {
  const addSeatInvalidTable = async () => {
    await playerModel.create({ Name: "Dan" });
    return await seatModel.create({
      PlayerName: "Dan",
      TableIdentifier: 1,
      Position: 0,
    });
  };
  await expect(addSeatInvalidTable).rejects.toThrow(ForeignKeyConstraintError);
});

test("Add a seat with an invalid player", async () => {
  const addSeatWithInvalidPlayer = async () =>
    await seatModel.create({
      PlayerName: "Zac",
      TableIdentifier: 0,
      Position: 3,
    });
  await expect(addSeatWithInvalidPlayer).rejects.toThrow(
    ForeignKeyConstraintError
  );
});

test("Add a duplicate seat", async () => {
  const addDuplicateSeat = async () => {
    charlieSeat.Position = 0;
    return await charlieSeat.save();
  };

  const charliePlayer = await playerModel.findByPk("Charlie");
  expect(charliePlayer).toEqual(expect.anything());
  expect(charliePlayer.Name).toEqual("Charlie");
  const charlieSeat = await charliePlayer.getSeat();
  expect(charlieSeat).toEqual(expect.anything());
  const charlieTableNumber = charlieSeat.TableIdentifier;
  expect(charlieTableNumber).toEqual(0);
  const charliePositionNumber = charlieSeat.Position;
  expect(charliePositionNumber).toEqual(2);
  await expect(addDuplicateSeat).rejects.toThrow(UniqueConstraintError);
});

test("Create a second table and move a player there", async () => {
  const newTable = await tableModel.create({ Identifier: 1 });
  expect(newTable).toEqual(expect.any(tableModel));
  const bobSeat = await seatModel.findByPk("Bob");
  expect(bobSeat).toEqual(expect.any(seatModel));
  expect(bobSeat.TableIdentifier).toEqual(0);
  expect(bobSeat.Position).toEqual(1);
  bobSeat.TableIdentifier = newTable.Identifier;
  bobSeat.Position = 0;
  await bobSeat.save();
  await bobSeat.reload();
  expect(bobSeat.TableIdentifier).toEqual(1);
  expect(bobSeat.Position).toEqual(0);
});

test("Remove a player", async () => {
  await removePlayer("Bob");
  const playerRows = await playerModel.findAll({ attributes: ["Name"] });
  const playerNames = playerRows.map((row) => row.Name);
  expect(playerNames).toEqual(expect.arrayContaining(["Alice", "Charlie"]));
  expect(playerNames).toEqual(expect.not.arrayContaining(["Bob"]));
});

test("Retrieve player rows", async () => {
  const playerRows = await selectAllPlayers();
  expect(playerRows).toEqual(
    expect.arrayContaining([
      expect.objectContaining({ Name: "Alice" }),
      expect.objectContaining({ Name: "Bob" }),
      expect.objectContaining({ Name: "Charlie" }),
    ])
  );
});

test("Retrieve player Ids", async () => {
  const playerNames = await selectPlayerIds();
  expect(playerNames).toEqual(expect.arrayContaining(["Alice", "Bob", "Charlie"]));
});

test("Create a table", async () => {
  const newTable = await createTable();
  expect(newTable.Identifier).toEqual(1);
});
test.todo("Delete a table");
test.todo("Delete table and then create one");
test.todo("Table zero can't be deleted");
