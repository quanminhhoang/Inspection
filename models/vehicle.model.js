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
		color: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		purpose: {
			type: DataTypes.ENUM('personal', 'business', 'unknown'),
			allowNull: false,
			defaultValue: 'unknown',
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
		ownerName: {
			type: DataTypes.STRING,
			allowNull: false,
			validate: {
				notEmpty: {
					msg: 'Fullname is required',
				},
			},
		},
		ownerPhone: {
			type: DataTypes.STRING,
			allowNull: true,
			unique: true,
			validate: {
				isMobilePhone: {
					args: ['any', 'en-US'],
					msg: 'Please enter a valid phone number',
				},
			},
		},
		ownerId: {
			type: DataTypes.INTEGER,
			allowNull: false,
		},
		expiredAt: {
			type: DataTypes.DATE,
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
