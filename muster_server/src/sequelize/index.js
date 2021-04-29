import { sequelize, test_connection } from "./sequelize";
import "./player";
import "./table";
import "./seat";

export { sequelize, test_connection };

export const addPlayer = async (PlayerName) => {
  const addPlayerTransactionBody = async () => {
    const Table = sequelize.models.Table;
    const Player = sequelize.models.Player;
    const Seat = sequelize.models.Seat;
    const [table0] = await Table.findOrCreate({
      where: { Identifier: sequelize.literal(0) },
    });
    const newPlayer = await Player.create({ Name: PlayerName });
    const playersAtT0 = await Seat.count({
      where: { TableIdentifier: table0.Identifier },
    });
    const newSeat = await Seat.create({
      PlayerName: newPlayer.Name,
      Position: playersAtT0,
    });
    return [newPlayer, newSeat];
  };
  return await sequelize.transaction(addPlayerTransactionBody);
};

export const removePlayer = async (PlayerName) => {
  const playerModel = sequelize.models.Player;
  const removePlayerTransactionBody = async () => {
    const targetPlayer = await playerModel.findByPk(PlayerName);
    await targetPlayer.destroy();
  };
  return await sequelize.transaction(removePlayerTransactionBody);
};

export const selectAllPlayers = async () => {
  const playerModel = sequelize.models.Player;
  const playerRows = await playerModel.findAll({
    attributes: { exclude: ["createdAt", "updatedAt"] },
  });
  return playerRows;
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
  const createTableTransactionBody = async () => {
    const newTable = await tableModel.create({});
    return newTable;
  };
  return await sequelize.transaction(createTableTransactionBody);
};
export const removeTable = async (TableIdentifier) => {
  // Should this delete the newest table by default?
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
  return await targetTable.destroy();
};
export const selectAllTables = async () => {};
export const selectTableIds = async () => {};
export const assignSeat = async () => {};
export const resetSeats = async () => {};
export const shuffleZero = async () => {};

if (process.env.NODE_ENV != "production") {
  sequelize.sync();
}

export default sequelize;
