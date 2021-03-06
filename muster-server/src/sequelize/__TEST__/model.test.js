import { ForeignKeyConstraintError, UniqueConstraintError } from "sequelize";
import {
  sequelize,
  addPlayer,
  removePlayer,
  selectAllPlayers,
  selectPlayerIds,
  createTable,
  removeTable,
  selectPlayerById,
  selectAllTables,
  selectTableIds,
  selectTableById,
  selectAllSeats,
  selectSeatById,
  selectSeatIds,
  selectSeatsAtTable,
  assignSeat,
  resetSeats,
  shuffleZero,
} from "..";

const playerModel = sequelize.models.Player;
const tableModel = sequelize.models.Table;
const seatModel = sequelize.models.Seat;

const defaultSetup = async () => {
  await addPlayer("Alice");
  await addPlayer("Bob");
  await addPlayer("Charlie");
};

const extendedSetup = async () => {
  await addPlayer("Dan");
  await addPlayer("Erin");
  await addPlayer("Frank");
  await createTable();
  await createTable();
  await createTable();
  await assignSeat("Bob", 3);
  await assignSeat("Alice", 3);
  await assignSeat("Dan", 2);
  await assignSeat("Charlie", 2);
  await assignSeat("Frank", 1);
  await assignSeat("Erin", 1);
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
  /* Due to the fact that sqlite doesn't have deffered unique constraints, and 
     update queries cannot be ordered, it is impractical to enforce a 
     uniqueness constraint on Seats(TableIdentifier, Position) because even
      single query operations treating positions as a list would fail.
  */
  const charliePlayer = await playerModel.findByPk("Charlie");
  expect(charliePlayer).toEqual(expect.any(playerModel));
  expect(charliePlayer).toEqual(expect.objectContaining({ Name: "Charlie" }));
  const charlieSeat = await charliePlayer.getSeat();
  expect(charlieSeat).toEqual(expect.any(seatModel));
  expect(charlieSeat).toEqual(
    expect.objectContaining({
      PlayerName: "Charlie",
      TableIdentifier: 0,
      Position: 2,
    })
  );
  charlieSeat.Position = 0;
  await charlieSeat.save();
  await charlieSeat.reload();
  expect(charlieSeat).toEqual(
    expect.objectContaining({
      PlayerName: "Charlie",
      TableIdentifier: 0,
      Position: 0,
    })
  );
});

test("Create a second table and move a player there", async () => {
  const newTable = await tableModel.create();
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
  const playerNames = await selectPlayerIds();
  const seats = await selectAllSeats();
  expect(playerNames).toEqual(expect.arrayContaining(["Alice", "Charlie"]));
  expect(playerNames).toEqual(expect.not.arrayContaining(["Bob"]));
  expect(seats).toEqual(
    expect.arrayContaining([
      expect.objectContaining({
        PlayerName: "Alice",
        Position: 0,
        TableIdentifier: 0,
      }),
      expect.objectContaining({
        PlayerName: "Charlie",
        Position: 1,
        TableIdentifier: 0,
      }),
    ])
  );
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
  expect(playerNames).toEqual(
    expect.arrayContaining(["Alice", "Bob", "Charlie"])
  );
});

test("selectPlayerById", async () => {
  const aliceRow = await selectPlayerById("Alice");
  expect(aliceRow).toEqual(expect.objectContaining({ Name: "Alice" }));
  const nonexistentPlayerRow = await selectPlayerById("NonexistentPlayer");
  expect(nonexistentPlayerRow).toBeNull();
});

test("Create a table", async () => {
  const newTable = await createTable();
  expect(newTable.Identifier).toEqual(1);
});
test("Delete a table", async () => {
  const newTable = await createTable();
  expect(newTable.Identifier).toEqual(1);
  await removeTable(newTable.Identifier);
  const tableRows = await tableModel.findAll({ attributes: ["Identifier"] });
  const tableIDList = tableRows.map((row) => row.Identifier);
  expect(tableIDList).toEqual([0]);
});
test("Delete table and then create one", async () => {
  const firstTable = await createTable();
  const secondTable = await createTable();
  expect(firstTable.Identifier).toEqual(1);
  expect(secondTable.Identifier).toEqual(2);
  await removeTable(firstTable.Identifier);
  const tableRows = await tableModel.findAll({ attributes: ["Identifier"] });
  const tableIDList = tableRows.map((row) => row.Identifier);
  expect(tableIDList).toEqual(expect.not.arrayContaining([1]));
  const thirdTable = await createTable();
  expect(thirdTable.Identifier).toEqual(3);
});
test("Delete a table that doesn't exist", async () => {
  const removeNonexistentTableFunc = async () => {
    return await removeTable(99);
  };
  await expect(removeNonexistentTableFunc).rejects.toThrow(ReferenceError);
});

describe("Delete a table with an invalid ID", () => {
  test("Using a non-integer key with the destroy function", async () => {
    const destroyTableFunc = async () => {
      return await (await tableModel.findByPk("Noninteger")).destroy();
    };
    return await expect(destroyTableFunc).rejects.toThrow(TypeError);
  });
  test("Using a non-numeric key with removeTable()", async () => {
    // This is just a fancy way of picking a table that doesn't exist.
    const removeNonNumericTableFunc = async () => {
      return await removeTable("Noninteger");
    };
    return await expect(removeNonNumericTableFunc).rejects.toThrow(
      ReferenceError
    );
  });
  test("Using a negative integer key with removeTable()", async () => {
    // This is just a fancy way of picking a table that doesn't exist.
    const removeNegativeTableFunc = async () => {
      return await removeTable("-99");
    };
    return await expect(removeNegativeTableFunc).rejects.toThrow(
      ReferenceError
    );
  });
});

test("Table zero can't be deleted", async () => {
  const removeTableZeroFunc = async () => {
    return await removeTable(0);
  };
  await expect(removeTableZeroFunc).rejects.toThrow(RangeError);
});
describe("Delete a table with seats", () => {
  test("Using the destroy function", async () => {
    const newTable = await createTable();
    expect(newTable.Identifier).toEqual(1);
    const bobPlayer = await playerModel.findByPk("Bob");
    const bobSeat = await bobPlayer.getSeat();
    expect(bobSeat).toEqual(
      expect.objectContaining({
        PlayerName: "Bob",
        TableIdentifier: 0,
        Position: 1,
      })
    );
    bobSeat.TableIdentifier = newTable.Identifier;
    bobSeat.Position = 0;
    await bobSeat.save();
    await bobSeat.reload();
    expect(bobSeat).toEqual(
      expect.objectContaining({
        PlayerName: "Bob",
        TableIdentifier: 1,
        Position: 0,
      })
    );
    await bobPlayer.destroy();
    expect(await seatModel.findByPk("Bob")).toBeNull();
    expect(await seatModel.findAll()).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ PlayerName: "Alice" }),
        expect.objectContaining({ PlayerName: "Charlie" }),
      ])
    );
    expect(await seatModel.findAll()).toEqual(
      expect.not.arrayContaining([
        expect.objectContaining({ PlayerName: "Bob" }),
      ])
    );
  });
  test("Using removeTable()", async () => {
    const newTable = await createTable();
    expect(newTable.Identifier).toEqual(1);
    await assignSeat("Bob", 1, 0);
    await assignSeat("Alice", 1, 1);
    const seatsWithSecondTable = await selectAllSeats();
    expect(seatsWithSecondTable).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          PlayerName: "Alice",
          Position: 1,
          TableIdentifier: 1,
        }),
        expect.objectContaining({
          PlayerName: "Bob",
          Position: 0,
          TableIdentifier: 1,
        }),
        expect.objectContaining({
          PlayerName: "Charlie",
          Position: 0,
          TableIdentifier: 0,
        }),
      ])
    );
    await removeTable(newTable.Identifier);
    const seatsWithTableRemoved = await selectAllSeats();
    expect(seatsWithTableRemoved).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          PlayerName: "Alice",
          Position: 2,
          TableIdentifier: 0,
        }),
        expect.objectContaining({
          PlayerName: "Bob",
          Position: 1,
          TableIdentifier: 0,
        }),
        expect.objectContaining({
          PlayerName: "Charlie",
          Position: 0,
          TableIdentifier: 0,
        }),
      ])
    );
  });
});

test("selectAllTables", async () => {
  const tableRows = await selectAllTables();
  expect(tableRows).toEqual(
    expect.arrayContaining([expect.objectContaining({ Identifier: 0 })])
  );
});
test("selectTableIds", async () => {
  const tableIds = await selectTableIds();
  expect(tableIds).toEqual(expect.arrayContaining([0]));
});
test("selectTableById from a number", async () => {
  const table = await selectTableById(0);
  expect(table).toEqual(expect.any(tableModel));
  expect(table).toEqual(expect.objectContaining({ Identifier: 0 }));
});
test("selectTableById from a string", async () => {
  /** this test demonstrates that the ORM automatically converts strings */
  const tableFromStringId = await selectTableById("0");
  expect(tableFromStringId).toEqual(expect.any(tableModel));
  expect(tableFromStringId).toEqual(expect.objectContaining({ Identifier: 0 }));
});

test("selectAllSeats", async () => {
  const seatRows = await selectAllSeats();
  expect(seatRows).toEqual(
    expect.arrayContaining([
      expect.objectContaining({
        PlayerName: "Alice",
        Position: 0,
        TableIdentifier: 0,
      }),
      expect.objectContaining({
        PlayerName: "Bob",
        Position: 1,
        TableIdentifier: 0,
      }),
      expect.objectContaining({
        PlayerName: "Charlie",
        Position: 2,
        TableIdentifier: 0,
      }),
    ])
  );
});
test("selectSeatById", async () => {
  const aliceSeat = await selectSeatById("Alice");
  expect(aliceSeat).toEqual(expect.any(seatModel));
  expect(aliceSeat).toEqual(
    expect.objectContaining({
      PlayerName: "Alice",
      Position: 0,
      TableIdentifier: 0,
    })
  );
});

test("selectSeatByID with absent key", async () => {
  const nobodySeat = await selectSeatById("Nobody");
  expect(nobodySeat).toBeNull();
});

test("selectSeatIds", async () => {
  const seatRows = await selectSeatIds();
  expect(seatRows).toEqual(expect.arrayContaining(["Alice", "Bob", "Charlie"]));
  expect(seatRows).toHaveLength(3);
});
test("selectSeatsAtTable", async () => {
  const seatsAtTable0 = await selectSeatsAtTable(0);
  expect(seatsAtTable0).toEqual(
    expect.arrayContaining([
      expect.objectContaining({
        PlayerName: "Alice",
        Position: 0,
        TableIdentifier: 0,
      }),
      expect.objectContaining({
        PlayerName: "Bob",
        Position: 1,
        TableIdentifier: 0,
      }),
      expect.objectContaining({
        PlayerName: "Charlie",
        Position: 2,
        TableIdentifier: 0,
      }),
    ])
  );
});
describe("assignSeat", () => {
  test("Position too high", async () => {
    await assignSeat("Alice", 0, 9999);
    const updatedSeats = await selectAllSeats();
    expect(updatedSeats).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          PlayerName: "Alice",
          Position: 2,
          TableIdentifier: 0,
        }),
        expect.objectContaining({
          PlayerName: "Bob",
          Position: 0,
          TableIdentifier: 0,
        }),
        expect.objectContaining({
          PlayerName: "Charlie",
          Position: 1,
          TableIdentifier: 0,
        }),
      ])
    );
  });
  test("Position too low", async () => {
    await assignSeat("Charlie", 0, -9999);
    const updatedSeats = await selectAllSeats();
    expect(updatedSeats).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          PlayerName: "Alice",
          Position: 1,
          TableIdentifier: 0,
        }),
        expect.objectContaining({
          PlayerName: "Bob",
          Position: 2,
          TableIdentifier: 0,
        }),
        expect.objectContaining({
          PlayerName: "Charlie",
          Position: 0,
          TableIdentifier: 0,
        }),
      ])
    );
  });
  test("assign to nonexistent table", async () => {
    const assignToNonexistentTableBody = async () => {
      return await assignSeat("Alice", 1, 0);
    };
    await expect(assignToNonexistentTableBody).rejects.toThrow(
      ForeignKeyConstraintError
    );
  });
  test("Assign between tables", async () => {
    await createTable();
    await assignSeat("Bob", 1);
    const seatData = await selectAllSeats();
    expect(seatData).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          PlayerName: "Alice",
          Position: 0,
          TableIdentifier: 0,
        }),
        expect.objectContaining({
          PlayerName: "Bob",
          Position: 0,
          TableIdentifier: 1,
        }),
        expect.objectContaining({
          PlayerName: "Charlie",
          Position: 1,
          TableIdentifier: 0,
        }),
      ])
    );
  });
  test("Assign within the same table", async () => {
    await createTable();
    await assignSeat("Bob", 0, 0);
    const seatData = await selectAllSeats();
    expect(seatData).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          PlayerName: "Alice",
          Position: 1,
          TableIdentifier: 0,
        }),
        expect.objectContaining({
          PlayerName: "Bob",
          Position: 0,
          TableIdentifier: 0,
        }),
        expect.objectContaining({
          PlayerName: "Charlie",
          Position: 2,
          TableIdentifier: 0,
        }),
      ])
    );
  });
});
test("resetSeats", async () => {
  await extendedSetup();
  await resetSeats();
  const updatedSeats = await selectAllSeats();
  expect(updatedSeats).toEqual(
    expect.arrayContaining([
      expect.objectContaining({
        PlayerName: "Frank",
        Position: 0,
        TableIdentifier: 0,
      }),
      expect.objectContaining({
        PlayerName: "Erin",
        Position: 1,
        TableIdentifier: 0,
      }),
      expect.objectContaining({
        PlayerName: "Dan",
        Position: 2,
        TableIdentifier: 0,
      }),
      expect.objectContaining({
        PlayerName: "Charlie",
        Position: 3,
        TableIdentifier: 0,
      }),
      expect.objectContaining({
        PlayerName: "Bob",
        Position: 4,
        TableIdentifier: 0,
      }),
      expect.objectContaining({
        PlayerName: "Alice",
        Position: 5,
        TableIdentifier: 0,
      }),
    ])
  );
});
test("shuffleZero", async () => {
  // Only table 0 is shuffled
  // The array of new positions is returned
  // The database is updated to reflec those positions

  await createTable();
  await addPlayer("Dan");
  await addPlayer("Erin");
  await addPlayer("Frank");
  await assignSeat("Dan", 1);
  await assignSeat("Erin", 1);
  await assignSeat("Frank", 1);
  const new_position_array = await shuffleZero();
  const seatsAtTable1 = await selectSeatsAtTable(1);
  expect(seatsAtTable1).toEqual(
    expect.arrayContaining([
      expect.objectContaining({
        PlayerName: "Dan",
        Position: 0,
        TableIdentifier: 1,
      }),
      expect.objectContaining({
        PlayerName: "Erin",
        Position: 1,
        TableIdentifier: 1,
      }),
      expect.objectContaining({
        PlayerName: "Frank",
        Position: 2,
        TableIdentifier: 1,
      }),
    ])
  );
  // The shuffled list of keys should have every integer from 0 to length - 1
  expect(new_position_array).toEqual(
    expect.arrayContaining([...Array(3).keys()])
  );
  const seatsAtTable0 = await selectSeatsAtTable(0);
  // Check that the new positions have been applied.
  expect(seatsAtTable0[new_position_array[0]]).toEqual(
    expect.objectContaining({ PlayerName: "Alice" })
  );
  expect(seatsAtTable0[new_position_array[1]]).toEqual(
    expect.objectContaining({ PlayerName: "Bob" })
  );
  expect(seatsAtTable0[new_position_array[2]]).toEqual(
    expect.objectContaining({ PlayerName: "Charlie" })
  );
});
