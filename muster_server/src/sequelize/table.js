import { DataTypes, QueryTypes } from "sequelize";
import sequelize from "./sequelize";

export const Table = sequelize.define("Table", {
  Identifier: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
});

export const getOrCreateTable0 = async () => {
  const Table = sequelize.models.Table;
  const fetchedTable0 = await Table.findByPk(0);
  if (fetchedTable0) {
    return fetchedTable0;
  }
  await sequelize.query(
    `INSERT INTO Tables(Identifier, createdAt, updatedAt) VALUES (0, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)`,
    {
      type: QueryTypes.INSERT,
    }
  );
  // const newT0 = Table.build({ Identifier: 0 }, {raw: true});
  // console.log("Built table", newT0);
  // const savedT0 = await newT0.save({validate: false});
  // console.log("Saved T0", savedT0);
  // savedT0.Identifier = 0
  // savedT0.save();
  // savedT0.reload();
  // console.log("Reloaded T0", savedT0)
  return await Table.findByPk(0);
};

console.log("Table model registered: ", Table === sequelize.models.Table);

export default Table;
