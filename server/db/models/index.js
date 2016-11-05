var Sequelize = require('sequelize');
var db = new Sequelize('postgres://localhost:5432/pump');

var PipeTable = db.define('pipe',{
  nps: {
    type: Sequelize.FLOAT
  },
  od: {
    type: Sequelize.FLOAT
  },
  5: {
    type: Sequelize.FLOAT
  },
  10: {
    type: Sequelize.FLOAT
  },
  20: {
    type: Sequelize.FLOAT
  },
  30: {
    type: Sequelize.FLOAT
  },
  40: {
    type: Sequelize.FLOAT
  },
  std: {
    type: Sequelize.FLOAT
  },
  xs: {
    type: Sequelize.FLOAT
  }


})

db.sync();
module.exports = db;
