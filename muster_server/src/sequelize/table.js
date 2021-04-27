import { DataTypes } from "sequelize";
import sequelize from "./sequelize";

export const Table = sequelize.define("Table", {
  Identifier: { type: DataTypes.NUMBER, primaryKey: true },
});

console.log("Table model registered: ", Table ===sequelize.models.Table);

export default Table;
