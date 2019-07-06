const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const basename = path.basename(__filename);

const config = require('../config');

const {
  postgresHost: host,
  postgresPort: port,
  postgresDatabase: database,
  postgresUser: username,
  postgresPassword: password
} = config;

const sequelize = new Sequelize(
  database,
  username,
  password,
  {
    host,
    port,
    database,
    username,
    password,
  },
);

const models = fs.readdirSync(__dirname)
  .filter(file => {
    return (
      file.indexOf('.') !== 0 && file !== basename && file.slice(-3) === '.js'
    );
  })
  .reduce((models, file) => {
    const model = require(path.join(__dirname, file));

    if (model.init) {
      model.init(sequelize);
    } else {
      model(sequelize, Sequelize);
    }

    return {
      ...models,
      [model.name]: model,
    };
  });

Object.values(models).forEach(model => {
  if (model.associate) {
    model.associate(models);
  }
});

module.exports = {
  async connect({ onConnected, onSync }) {
    await sequelize.authenticate();
    onConnected && onConnected();

    await sequelize.sync();
    onSync && onSync();
  },
  sequelize,
  Sequelize,
  models,
}
