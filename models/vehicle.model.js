module.exports = (sequelize, DataTypes) => {
	const Vehicle = sequelize.define('Vehicle', {
		id: {
			allowNull: false,
			autoIncrement: true,
			primaryKey: true,
			type: DataTypes.INTEGER,
		},
		status: {
			type: DataTypes.ENUM('approved', 'in_process', 'rejected'),
			allowNull: false,
			defaultValue: 'in_process',
		},
		plate: {
			type: DataTypes.STRING,
			allowNull: false,
			unique: true,
		},
		make: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		model: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		year: {
			type: DataTypes.INTEGER,
			allowNull: false,
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
	Vehicle.associate = (models) => {
		Vehicle.hasOne(models.result, {
			foreignKey: 'vehicleId',
		});
	};

	return Vehicle;
};
