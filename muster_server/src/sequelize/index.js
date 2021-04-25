import { sequelize, test_connection } from "./sequelize";
import "./player";
import "./table";
import "./seat";

export { sequelize, test_connection };
if (process.env.NODE_ENV != "production") {
  sequelize.sync();
}

export default sequelize;
