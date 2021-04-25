import { DataTypes } from "sequelize";
import sequelize from "./sequelize";

export const Seat = sequelize.define("Seat", {
  playerName: {
    type: DataTypes.STRING,
    primaryKey: true,
    references: {
      model: sequelize.models.Player,
      key: "name",
    },},
    table:{
        type: DataTypes.NUMBER,
        unique: "TableSeatUniqueness",
        references: {
            model: sequelize.models.Table,
            key: "identifier"
        }
    },
    position:{
        type: DataTypes.NUMBER,
        allowNull: false,
        unique: "TableSeatUniqueness",
    }
  },
);

console.log("Seat model registered: ", Seat === sequelize.models.Seat);

export default Seat;
