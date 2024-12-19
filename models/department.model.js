module.exports = (sequelize, Sequelize, DataTypes) => {
	const Department = sequelize.define('Departments', {
		id: {
			allowNull: false,
			autoIncrement: true,
			primaryKey: true,
			type: DataTypes.INTEGER,
		},
		userId: {
			type: Sequelize.INTEGER,
			references: {
				model: 'users',
				key: 'id',
			},
		},
		name: {
			type: DataTypes.STRING,
			allowNull: false,
			unique: true,
		},
		description: {
			type: DataTypes.STRING,
			allowNull: true,
		},
		email: {
			type: DataTypes.STRING,
			allowNull: false,
			unique: true,
			validate: {
				isEmail: {
					msg: 'Please enter a valid email address',
				},
				notEmpty: {
					msg: 'Email is required',
				},
			},
		},
		phone: {
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
		createdAt: {
			allowNull: false,
			type: Sequelize.DATE,
		},
		updatedAt: {
			allowNull: false,
			type: Sequelize.DATE,
		},
	});

	Department.associate = function (models) {
		Department.belongsTo(models.user, {
			foreignKey: 'userId',
		});
		Department.hasMany(models.result, {
			foreignKey: 'departmentId',
		});
	};

	return Department;
};
