const { Sequelize, DataTypes, Op } = require('sequelize');
const dbConfig = require('../config/db.config.js');

const sequelize = new Sequelize(
	dbConfig.development.database,
	dbConfig.development.username,
	dbConfig.development.password,
	{
		host: dbConfig.development.host,
		dialect: dbConfig.development.dialect,
		port: dbConfig.development.port,
	}
);

//
const db = {};

db.sequelize = sequelize;
db.Sequelize = Sequelize;
db.Op = Op;

//
db.user = require('./user.model.js')(sequelize, Sequelize, DataTypes);
db.department = require('./department.model.js')(
	sequelize,
	Sequelize,
	DataTypes
);
db.result = require('./result.model.js')(sequelize, Sequelize, DataTypes);
db.vehicle = require('./vehicle.model.js')(sequelize, Sequelize, DataTypes);

//
Object.keys(db).forEach((modelName) => {
	if (db[modelName].associate) {
		db[modelName].associate(db);
	}
});

module.exports = db;
