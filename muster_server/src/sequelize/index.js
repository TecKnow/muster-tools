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

    const newPlayer = await Player.create(
      { Name: PlayerName },
    );
    const [table0] = await Table.findOrCreate({ where: {Identifier: 0} });
    const playersAtT0 = await table0.countSeats();
    const newSeat = await Seat.create({
      PlayerName: newPlayer.Name,
      TableIdentifier: table0.TableIdentifier,
      Position: playersAtT0,
    });
    return [newPlayer, newSeat];
  };
  return sequelize.transaction(addPlayerTransactionBody);
};

if (process.env.NODE_ENV != "production") {
  sequelize.sync();
}

export default sequelize;
