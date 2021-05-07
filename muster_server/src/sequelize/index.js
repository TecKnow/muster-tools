import { Op } from "sequelize";
import { sequelize, test_connection } from "./sequelize";
import "./player";
import "./table";
import "./seat";

export { sequelize, test_connection };

const _removePlayerSeat = async (PlayerName) => {
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

const _insertSeatAtTable = async (PlayerName, TableIdentifier, Position) => {
  const seatModel = sequelize.models.Seat;
  const targetSeat = await seatModel.findByPk(PlayerName);
  if (targetSeat.Position !== null) {
    throw new RangeError(
      `The seat already has a position, it must be removed first: ${JSON.stringify(
        targetSeat
      )}`
    );
  }
  const seatsAtTargetTable = await countSeatsAtTable(TableIdentifier);
  const normalizedPosition =
    Position < 0
      ? 0
      : Position > seatsAtTargetTable
      ? seatsAtTargetTable
      : Position;
  await seatModel.update(
    { Position: sequelize.literal("Position + 1") },
    {
      where: { TableIdentifier, Position: { [Op.gte]: normalizedPosition } },
    }
  );
  targetSeat.TableIdentifier = TableIdentifier;
  targetSeat.Position = normalizedPosition;
  await targetSeat.save();
  return targetSeat;
};

const _seatPositionRenumber = (
  seatArray,
  TableIdentifier = undefined,
  starting_index = 0
) => {
  /**
   * Update the position values of the seat objects to match their positions in the provided array.
   * TableIdentifier must be provided if players may be moving between tables.
   * If TableIdentifier isn't provided, it will be taken from the first seat seat in the list.
   *
   * Providing a starting position allows the list to be appended to an existing table.
   * For example, when an existing table is deleted and the seats there are returned to table 0.
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
    seat.TableIdentifier = sequelize.literal(TableIdentifier);
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

  const affectedSeats = await sequelize.models.Seat.findAll({
    where: { TableIdentifier: [0, TableIdentifier] },
    order: [
      ["TableIdentifier", "ASC"],
      ["Position", "ASC"],
    ],
    attributes: { exclude: ["createdAt", "updatedAt"] },
  });
  _seatPositionRenumber(affectedSeats, 0, 0);
  Promise.all(
    Array.prototype.map.call(affectedSeats, async (seat) => await seat.save())
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
  await _removePlayerSeat(PlayerName);
  await (await playerModel.findByPk(PlayerName)).destroy();
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
  if (Number(TableIdentifier) === 0) {
    throw new RangeError("Table 0 is the default and cannot be deleted.");
  }
  const targetTable = await sequelize.models.Table.findByPk(TableIdentifier);
  if (targetTable === null) {
    throw new ReferenceError(`Table ${TableIdentifier} does not exist`);
  }
  await appendToTableZero(TableIdentifier);
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
    order: [
      ["TableIdentifier", "ASC"],
      ["Position", "ASC"],
    ],
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
  await _removePlayerSeat(PlayerName);
  await _insertSeatAtTable(PlayerName, TableIdentifier, Position);
};

export const resetSeats = async () => {
  const affectedSeats = await selectAllSeats();
  _seatPositionRenumber(affectedSeats, 0, 0);
  Promise.all(
    Array.prototype.map.call(affectedSeats, async (seat) => await seat.save())
  );
};

export const shuffleZero = async () => {
  // Why are we creating an array of a range of integers?
  // Clients must be updated and sending them the new order is efficient
  const tableZeroSeats = await sequelize.models.Seat.findAll({
    where: { TableIdentifier: 0 },
    attributes: { exclude: ["createdAt", "updatedAt"] },
  });
  const num_players_to_shuffle = tableZeroSeats.length;
  const positions_array = [...Array(num_players_to_shuffle).keys()];
  // Knuth shuffle
  for (let i = positions_array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * i);
    [positions_array[i], positions_array[j]] = [
      positions_array[j],
      positions_array[i],
    ];
  }
  Promise.all(
    Array.prototype.map.call(tableZeroSeats, async (seat, idx) => {
      seat.Position = positions_array[idx];
      await seat.save();
    })
  );
  return positions_array;
};

if (process.env.NODE_ENV != "production") {
  sequelize.sync();
}

export default sequelize;
