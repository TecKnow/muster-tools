import { DataTypes } from "sequelize";
import sequelize from "./sequelize";

export const Seat = sequelize.define("Seat", {
  PlayerName:{
    type: DataTypes.STRING,
    primaryKey: true,
  },

  /* TODO: Now that there is no compound uniqueness constraint on (TableIdentifier, Position)
     these columns can probably be defined inline with their associations below.
  */
  TableIdentifier:{
    type: DataTypes.INTEGER,
    allowNull: true,
    defaultValue: 0,
  },
  
  Position: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
});

const Table = sequelize.models.Table;
const Player = sequelize.models.Player;

Player.hasOne(Seat);
Seat.belongsTo(Player);

Table.hasMany(Seat);
Seat.belongsTo(Table);

export default Seat;
