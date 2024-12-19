module.exports = (sequelize, DataTypes) => {
	const Result = sequelize.define('Result', {
		id: {
			allowNull: false,
			autoIncrement: true,
			primaryKey: true,
			type: DataTypes.INTEGER,
		},
		status: {
			type: DataTypes.INTEGER,
			allowNull: false,
		},
		comment: {
			type: DataTypes.STRING,
			allowNull: true,
		},
		vehicleId: {
			type: DataTypes.INTEGER,
			allowNull: false,
			references: {
				model: 'Vehicles',
				key: 'id',
			},
		},
		departmentId: {
			type: DataTypes.INTEGER,
			allowNull: false,
			references: {
				model: 'Departments',
				key: 'id',
			},
		},
		createdAt: {
			type: DataTypes.DATE,
			allowNull: false,
			defaultValue: DataTypes.NOW,
		},
		updatedAt: {
			type: DataTypes.DATE,
			allowNull: false,
			defaultValue: DataTypes.NOW,
		},
	});

	// Associations
	Result.associate = (models) => {
		Result.belongsTo(models.vehicle, {
			foreignKey: 'vehicleId',
		});

		Result.belongsTo(models.department, {
			foreignKey: 'departmentId',
		});
	};

	return Result;
};
