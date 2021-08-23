let config = require("../config.json");
let Sequelize = require("sequelize");

const auth = config.mysql;
const options = {
  host: auth.ip,
  port: auth.port,
  dialect: "mysql",
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
};
db = new Sequelize(auth.schema, auth.username, auth.password, options);

module.exports = async function (
  column,
  schema,
  table,
  varToMatch,
  varToMatchValue
) {
  let Value = await db.query(
    `SELECT ${column} FROM ${schema}.${table} WHERE ${varToMatch} = ${varToMatchValue}`,
    { plain: true, type: Sequelize.QueryTypes.SELECT }
  );
  let value = Value[column];
  if (!value) return false;
  else return value;
};
