const db = require('../models/index.model.js');
const Vehicle = db.vehicle;
const Op = db.Op;

const createVehicle = async (req, res, next) => {
	const {
		plate,
		make,
		model,
		year,
		ownerId,
		ownerPhone,
		ownerName,
		color,
		purpose,
	} = req.body;

	// Validate input
	if (
		!plate ||
		!make ||
		!model ||
		!year ||
		!ownerId ||
		!ownerName ||
		!color ||
		!purpose
	) {
		return res.status(400).json('All fields are required.');
	}

	if (year < 1886 || year > new Date().getFullYear() + 1) {
		return next(
			res.status(400).json('Year must be a valid car manufacturing year.')
		);
	}

	const validPurposes = ['personal', 'business', 'unknown'];
	if (!validPurposes.includes(purpose)) {
		return res
			.status(400)
			.json('Purpose must be personal, business, or unknown.');
	}

	try {
		const currentDate = new Date();
		const expiredAt = new Date(
			currentDate.setFullYear(currentDate.getFullYear() + 1)
		);
		// Create the vehicle
		const vehicle = await Vehicle.create({
			plate,
			make,
			model,
			year,
			ownerId,
			ownerPhone,
			ownerName,
			color,
			purpose,
			expiredAt,
		});
		res.status(201).json(vehicle);
	} catch (error) {
		// Handle unique constraint error for plate
		if (error.name === 'SequelizeUniqueConstraintError') {
			return res.status(400).json('A vehicle with this plate already exists.');
		}
		next(error);
	}
};

const updateVehicle = async (req, res, next) => {
	const {
		status,
		plate,
		make,
		model,
		year,
		ownerId,
		ownerPhone,
		ownerName,
		expiredAt,
		color,
		purpose,
	} = req.body;

	const validStatuses = ['in_process', 'rejected', 'approved'];
	if (status && !validStatuses.includes(status)) {
		return res.status(400).json('Invalid status.');
	}

	const validPurposes = ['personal', 'business', 'unknown'];
	if (purpose && !validPurposes.includes(purpose)) {
		return res.status(400).json('Invalid purpose.');
	}

	try {
		const [updated] = await Vehicle.update(
			{
				status,
				plate,
				make,
				model,
				year,
				ownerId,
				ownerPhone,
				ownerName,
				expiredAt,
				color,
				purpose,
			},
			{ where: { id: req.params.id }, returning: true }
		);

		if (updated === 0) {
			return res.status(404).json('Vehicle not found.');
		}

		const updatedVehicle = await Vehicle.findOne({
			where: { id: req.params.id },
		});
		res.status(200).json(updatedVehicle);
	} catch (error) {
		next(error);
	}
};

const deleteVehicle = async (req, res, next) => {
	try {
		const deleted = await Vehicle.destroy({
			where: { id: req.params.id },
		});

		if (deleted === 0) {
			return res.status(404).json('Vehicle not found');
		}

		res.status(200).json('Vehicle has been deleted');
	} catch (error) {
		next(error);
	}
};

const findVehicleById = async (req, res, next) => {
	try {
		const vehicle = await Vehicle.findByPk(req.params.id);

		if (!vehicle) {
			return res.status(404).json('Vehicle not found');
		}

		res.status(200).json(vehicle);
	} catch (error) {
		next(error);
	}
};

const findVehicleByPlate = async (req, res, next) => {
	try {
		const vehicle = await Vehicle.findOne({
			where: { plate: req.params.plate },
		});

		if (!vehicle) {
			return res.status(404).json('Vehicle not found');
		}

		res.status(200).json(vehicle);
	} catch (error) {
		next(error);
	}
};

const findAllVehicles = async (req, res, next) => {
	try {
		const vehicles = await Vehicle.findAll();

		if (!vehicles) {
			return res.status(404).json('Vehicle not found');
		}

		res.status(200).json(vehicles);
	} catch (error) {
		next(error);
	}
};

const viewVehicleStatistics = async (req, res, next) => {
	try {
		const { period } = req.body;

		let groupBy;
		switch (period) {
			case 'month':
				groupBy = db.sequelize.fn('MONTH', db.sequelize.col('createdAt'));
				break;
			case 'quarter':
				groupBy = db.sequelize.fn('QUARTER', db.sequelize.col('createdAt'));
				break;
			case 'year':
				groupBy = db.sequelize.fn('YEAR', db.sequelize.col('createdAt'));
				break;
			default:
				return res
					.status(400)
					.json('Invalid period. Use month, quarter, or year.');
		}

		const statistics = await Vehicle.findAll({
			attributes: [
				[groupBy, 'period'],
				[db.sequelize.fn('COUNT', db.sequelize.col('id')), 'vehicleCount'],
			],
			group: 'period',
			order: [['period', 'ASC']],
		});

		res.status(200).json(statistics);
	} catch (error) {
		next(error);
	}
};

const viewExpireVehicles = async (req, res, next) => {
	try {
		const currentDate = new Date();

		const expiredVehicles = await Vehicle.findAll({
			where: {
				expiredAt: {
					[Op.lte]: currentDate,
				},
			},
		});

		if (expiredVehicles.length === 0) {
			return res.status(404).json({ message: 'No expired vehicles found.' });
		}

		res.status(200).json(expiredVehicles);
	} catch (error) {
		next(error);
	}
};

module.exports = {
	createVehicle,
	findVehicleById,
	findVehicleByPlate,
	deleteVehicle,
	updateVehicle,
	findAllVehicles,
	viewExpireVehicles,
	viewVehicleStatistics,
};
