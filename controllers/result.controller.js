const db = require('../models/index.model.js');
const Result = db.result;
const Department = db.department;
const Vehicle = db.vehicle;

// Create a new result
const createResult = async (req, res, next) => {
	const { status, comment, vehicleId, departmentId } = req.body;

	const department = await Department.findByPk(departmentId, {
		attributes: ['id'],
	});
	if (!department) {
		return res.status(404).json('Department not found.');
	}

	const vehicle = await Vehicle.findByPk(vehicleId);
	if (!vehicle) {
		return res.status(404).json('Vehicle not found');
	}

	// Validate input
	if (status === undefined) {
		return res.status(400).json('Status are required.');
	}

	try {
		// Create the result
		const result = await Result.create({
			status,
			comment,
			vehicleId,
			departmentId,
		});
		res.status(201).json(result);
	} catch (error) {
		next(error);
	}
};

// Get all results
const findAllResults = async (req, res, next) => {
	try {
		const results = await Result.findAll({
			include: [{ model: Vehicle }, { model: Department }],
		});

		if (!results.length) {
			return res.status(404).json('No results found.');
		}

		res.status(200).json(results);
	} catch (error) {
		next(error);
	}
};

// Get a result by ID
const findResultById = async (req, res, next) => {
	try {
		const result = await Result.findByPk(req.params.id, {
			include: [{ model: Vehicle }, { model: Department }],
		});

		if (!result) {
			return res.status(404).json('Result not found.');
		}

		res.status(200).json(result);
	} catch (error) {
		next(error);
	}
};

// Update a result
const updateResult = async (req, res, next) => {
	const { status, comment } = req.body;

	const result = await Result.findByPk(req.params.id);

	if (!result) {
		return res.status(404).json('Result not found.');
	}

	try {
		const [updated] = await Result.update(
			{ status, comment },
			{
				where: { id: req.params.id },
				returning: true,
			}
		);

		if (updated === 0) {
			return res.status(404).json('Result not found.');
		}

		const updatedResult = await Result.findByPk(req.params.id, {
			include: [{ model: Vehicle }, { model: Department }],
		});
		res.status(200).json(updatedResult);
	} catch (error) {
		next(error);
	}
};

// Delete a result
const deleteResult = async (req, res, next) => {
	try {
		const deleted = await Result.destroy({
			where: { id: req.params.id },
		});

		if (deleted === 0) {
			return res.status(404).json('Result not found.');
		}

		res.status(200).json({ message: 'Result deleted successfully.' });
	} catch (error) {
		next(error);
	}
};

module.exports = {
	createResult,
	findAllResults,
	findResultById,
	updateResult,
	deleteResult,
};
