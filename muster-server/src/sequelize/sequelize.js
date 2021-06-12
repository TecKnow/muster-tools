import cls from "cls-hooked";
import { Sequelize } from "sequelize";

const NODE_ENV = process.env.NODE_ENV;
const DB_URI_ENV = process.env.DB_URI;
const DB_URI =
  NODE_ENV === "test" || !DB_URI_ENV ? "sqlite::memory" : DB_URI_ENV;
const default_logger = console.log;
const verbose_logger = (...msg) => console.log(msg);
const LOGGING_ENV = process.env.LOGGING;
const logging =
  LOGGING_ENV === "verbose"
    ? verbose_logger
    : LOGGING_ENV || NODE_ENV === "test"
    ? default_logger
    : false;
const namespace = cls.createNamespace("muster_sequelize_namespace");
Sequelize.useCLS(namespace);
export const sequelize = new Sequelize(DB_URI, { logging });

export const test_connection = async () => {
  try {
    await sequelize.authenticate();
    console.log("Connection has been established successfully");
    return sequelize;
  } catch (error) {
    console.error("unable to connect to the database: ", error);
  }
};

export default sequelize;
