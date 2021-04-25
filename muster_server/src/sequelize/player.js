import { DataTypes } from "sequelize";
import sequelize from "./sequelize";

export const Player = sequelize.define("Player", {
  name: { type: DataTypes.STRING, primaryKey: true },
});

console.log("Player model registered: ", Player===sequelize.models.Player);

export default Player;
