const mysql = require("mysql2");

const Sequelize = require("sequelize");

const sequelize = new Sequelize("node-complete", "root", "kalpesh-kumar", {
  dialect: "mysql",
  host: "localhost",
});

module.exports = sequelize;

