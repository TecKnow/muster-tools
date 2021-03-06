import { DataTypes } from "sequelize";
import sequelize from "./sequelize";

export const Table = sequelize.define("Table", {
  Identifier: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
});

export default Table;
