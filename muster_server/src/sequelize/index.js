import { Op } from "sequelize";
import { sequelize, test_connection } from "./sequelize";
import "./player";
import "./table";
import "./seat";

export { sequelize, test_connection };

export const _removePlayerSeat = async (PlayerName) => {
  const seatModel = sequelize.models.Seat;
  const targetSeat = await seatModel.findByPk(PlayerName);
  const originalTableId = targetSeat.TableIdentifier;
  const originalPosition = targetSeat.Position;
  targetSeat.Position = null;
  targetSeat.TableIdentifier = null;
  await targetSeat.save();
  const results = await seatModel.update(
    { Position: sequelize.literal("Position - 1") },
    {
      where: {
        TableIdentifier: originalTableId,
        Position: { [Op.gt]: originalPosition },
      },
    }
  );
  return results;
};

export const _insertSeatAtTable = async (PlayerName, TableIdentifier, Position) => {
  const seatModel = sequelize.models.Seat;
  const results = await seatModel.update(
    { Position: sequelize.literal("Position + 1") },
    {
      where: { TableIdentifier, Position: { [Op.gte]: Position } },
      order: [["Position", "ASC"]],
    }
  );
  return results;
};

const seatPositionSortFunction = (a, b) => a.Position - b.Position;

const seatPositionRenumber = (
  seatArray,
  TableIdentifier = undefined,
  starting_index = 0
) => {
  /**
   * Update the position values of the seat objects to match their positions in the provided array.
   * TableIdentifier must be provided if players may be moving between tables.
   * If TableIdentifier isn't provided, it will be taken from the first seat seat in the list.
   *
   * Providing a starting position allows the list to be functionally appended to an existing table.
   * This is espected to be used when a table is deleted and the affected players are returned to table 0 for example
   * THIS FUNCTION DOES NOT SAVE TO THE DATABASE
   * THIS FUNCTION IS SYNCRONOUS.
   *
   * returns an array of updated seat objects.
   */
  TableIdentifier =
    TableIdentifier !== undefined
      ? TableIdentifier
      : seatArray[0].TableIdentifier;

  const updatedArray = Array.prototype.map.call(seatArray, (seat, index) => {
    seat.TableIdentifier = TableIdentifier;
    seat.Position = starting_index + index;
    return seat;
  });
  return updatedArray;
};

const appendToTableZero = async (TableIdentifier) => {
  /**
   * Moves the seats at the target table to the end of Table 0
   * THIS FUNCTION DOES SAVE TO THE DATABASE
   * THIS FUNCTION IS ASYNC
   */
  const seatsAtTargetTable = selectSeatsAtTable(TableIdentifier);
  const seatsAtTableZero = countSeatsAtTable(0);
  seatPositionRenumber(seatsAtTargetTable, 0, seatsAtTableZero);
  Promise.all(
    Array.prototype.map.call(
      seatsAtTargetTable,
      async (seat) => await seat.save()
    )
  );
};

const countSeatsAtTable = async (TableIdentifier) => {
  const seatModel = sequelize.models.Seat;
  const seatCount = await seatModel.count({ where: { TableIdentifier } });
  return seatCount;
};

export const addPlayer = async (PlayerName) => {
  const Table = sequelize.models.Table;
  const Player = sequelize.models.Player;
  const Seat = sequelize.models.Seat;
  const [table0] = await Table.findOrCreate({
    where: { Identifier: sequelize.literal(0) },
  });
  const newPlayer = await Player.create({ Name: PlayerName });
  const playersAtT0 = await countSeatsAtTable(table0.Identifier);
  const newSeat = await Seat.create({
    PlayerName: newPlayer.Name,
    Position: playersAtT0,
  });
  return [newPlayer, newSeat];
};

export const removePlayer = async (PlayerName) => {
  const playerModel = sequelize.models.Player;
  const targetPlayer = await playerModel.findByPk(PlayerName);
  const targetSeat = await targetPlayer.getSeat();
  const targetTableId = targetSeat.TableIdentifier;
  const targetPosition = targetSeat.Position;
  const targetTableSeatsArray = await selectSeatsAtTable(targetTableId);
  Array.prototype.splice.call(targetTableSeatsArray, targetPosition, 1);
  await targetSeat.destroy();
  seatPositionRenumber(targetTableSeatsArray);
  Promise.all(
    Array.prototype.map.call(
      targetTableSeatsArray,
      async (seat) => await seat.save()
    )
  );
  await targetPlayer.destroy();
};

export const selectAllPlayers = async () => {
  const playerModel = sequelize.models.Player;
  const playerRows = await playerModel.findAll({
    attributes: { exclude: ["createdAt", "updatedAt"] },
  });
  return playerRows;
};

export const selectPlayerById = async (PlayerName) => {
  const playerModel = sequelize.models.Player;
  const playerRow = await playerModel.findByPk(PlayerName, {
    attributes: { exclude: ["createdAt", "updatedAt"] },
  });
  return playerRow;
};

export const selectPlayerIds = async () => {
  const playerModel = sequelize.models.Player;
  const playerRows = await playerModel.findAll({
    attributes: { include: ["Name"] },
  });
  const playerNameList = playerRows.map((row) => row.Name);
  return playerNameList;
};

export const createTable = async () => {
  const tableModel = sequelize.models.Table;
  const newTable = await tableModel.create({});
  return newTable;
};

export const removeTable = async (TableIdentifier) => {
  //TODO: This needs to move players to T0 when their table is deleted.
  const tableModel = sequelize.models.Table;
  const intTableIdentifier = Number(TableIdentifier);
  if (
    isNaN(intTableIdentifier) ||
    !Number.isInteger(intTableIdentifier) ||
    intTableIdentifier < 0
  ) {
    throw new TypeError("Table Identifiers must be non-negative integers");
  } else if (TableIdentifier === 0) {
    throw new RangeError("Table 0 is the default and cannot be deleted.");
  }
  const targetTable = await tableModel.findByPk(intTableIdentifier);
  if (!targetTable) {
    throw new ReferenceError(`Table ${TableIdentifier} does not exist`);
  }
  await appendToTableZero(intTableIdentifier);
  return await targetTable.destroy();
};
export const selectAllTables = async () => {
  const tableModel = sequelize.models.Table;
  const tableRows = await tableModel.findAll({
    attributes: { exclude: ["createdAt", "updatedAt"] },
  });
  return tableRows;
};
export const selectTableIds = async () => {
  const tableModel = await sequelize.models.Table;
  const tableRows = await tableModel.findAll({
    attributes: { include: ["Identifier"] },
  });
  const tableIds = Array.prototype.map.call(tableRows, (row) => row.Identifier);
  return tableIds;
};
export const selectTableById = async (TableIdentifier) => {
  const tableModel = sequelize.models.Table;
  const result = await tableModel.findByPk(TableIdentifier, {
    attributes: { exclude: ["createdAt", "updatedAt"] },
  });
  return result;
};
export const selectAllSeats = async () => {
  const seatModel = sequelize.models.Seat;
  const seatRows = await seatModel.findAll({
    attributes: { exclude: ["createdAt", "updatedAt"] },
  });
  return seatRows;
};
export const selectSeatById = async (PlayerName) => {
  const seatModel = sequelize.models.Seat;
  const result = await seatModel.findByPk(PlayerName, {
    attributes: { exclude: ["createdAt", "updatedAt"] },
  });
  return result;
};
export const selectSeatIds = async () => {
  const seatModel = await sequelize.models.Seat;
  const tableRows = await seatModel.findAll({
    attributes: { include: ["PlayerName"] },
  });
  const TableIds = Array.prototype.map.call(tableRows, (row) => row.PlayerName);
  return TableIds;
};

export const selectSeatsAtTable = async (TableIdentifier) => {
  const seatModel = sequelize.models.Seat;
  const seatsAtTable = await seatModel.findAll({
    where: { TableIdentifier },
    order: [["Position", "ASC"]],
    attributes: { exclude: ["createdAt", "updatedAt"] },
  });
  return seatsAtTable;
};

export const assignSeat = async (
  PlayerName,
  TableIdentifier,
  Position = Number.MAX_SAFE_INTEGER
) => {
  const seatModel = sequelize.models.Seat;
  const playerSeat = await seatModel.findByPk(PlayerName);
  const originalTableIdentifier = playerSeat.TableIdentifier;
  const destinationTableIdentifier = TableIdentifier;
  const originalPostion = playerSeat.Position;
  const destinationPosition = Position;
  const originalTableArray = await selectSeatsAtTable(originalTableIdentifier);
  // If the move is within the same table,
  // avoid fetching two arrays because the same player
  // will appear in both.
  if (Number(originalTableIdentifier) === Number(destinationTableIdentifier)) {
    Array.prototype.splice.call(originalTableArray, originalPostion, 1);
    Array.prototype.splice.call(
      originalTableArray,
      destinationPosition,
      0,
      playerSeat
    );
    seatPositionRenumber(originalTableArray);
    await Promise.all(
      Array.prototype.map.call(
        originalTableArray,
        async (seat) => await seat.save()
      )
    );
    return playerSeat;
  }
  const destinationTableArray = await selectSeatsAtTable(
    destinationTableIdentifier
  );
  Array.prototype.splice.call(originalTableArray, originalPostion, 1);
  Array.prototype.splice.call(
    destinationTableArray,
    destinationPosition,
    0,
    playerSeat
  );

  seatPositionRenumber(destinationTableArray);
  await Promise.all(
    Array.prototype.map.call(
      destinationTableArray,
      async (seat) => await seat.save()
    )
  );

  seatPositionRenumber(originalTableArray);
  await Promise.all(
    Array.prototype.map.call(
      originalTableArray,
      async (seat) => await seat.save()
    )
  );

  return playerSeat;
};
export const resetSeats = async () => {};
export const shuffleZero = async () => {};

if (process.env.NODE_ENV != "production") {
  sequelize.sync();
}

export default sequelize;
