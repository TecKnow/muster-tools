import { sequelize, test_connection } from "./sequelize";
import "./player";
import "./table";
import "./seat";

export { sequelize, test_connection };

export const addPlayer = async (PlayerName) => {
  const addPlayerTransactionBody = async () => {
    const Player = sequelize.models.Player;
    const Table = sequelize.models.Table;
    const Seat = sequelize.models.Seat;

    const newPlayer = await Player.create({ Name: PlayerName });
    const [table0] = await Table.findOrCreate({ where: { Identifier: 0 } });
    const playersAtT0 = await table0.countSeats();
    const newSeat = await Seat.create({
      PlayerName: newPlayer.Name,
      TableIdentifier: table0.TableIdentifier,
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
  const playerRows = await playerModel.findAll({attributes: {exclude: ["createdAt", "updatedAt"]} });
  return playerRows;
};

export const selectPlayerIds = async () => {
  const playerModel = sequelize.models.Player;
  const playerRows = await playerModel.findAll({attributes: {include: ["Name"]}})
  const playerNameList =  playerRows.map((row) => row.Name);
  return playerNameList;
};

const createTable = async () => {};
const removeTable = async () => {};
const selectAllTables = async () => {};
const selectTableIds = async () => {};
const assignSeat = async () => {};
const resetSeats = async () => {};
const shuffleZero = async () => {};

if (process.env.NODE_ENV != "production") {
  sequelize.sync();
}

export default sequelize;
