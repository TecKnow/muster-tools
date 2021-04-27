import { DataTypes } from "sequelize";
import sequelize from "./sequelize";

export const Seat = sequelize.define("Seat", {
  PlayerName:{
    type: DataTypes.STRING,
    primaryKey: true,
  },

  TableIdentifier:{
    type: DataTypes.NUMBER,
    defaultValue: 0,
    allowNull: false,
    unique: "TableSeatUniqueness"
  },
  
  Position: {
    type: DataTypes.NUMBER,
    allowNull: false,
    unique: "TableSeatUniqueness",
  },
});

const Table = sequelize.models.Table;
const Player = sequelize.models.Player;

Player.hasOne(Seat);
Seat.belongsTo(Player);

Table.hasMany(Seat);
Seat.belongsTo(Table);

console.log("Seat model registered: ", Seat === sequelize.models.Seat);

export default Seat;
