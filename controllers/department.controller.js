const db = require('../models/index.model.js');
const Department = db.department;

// Create a new department
const createDepartment = async (req, res, next) => {
	const { ownerId, name, description, email, phone } = req.body;

	// Validate input
	if (!name || !email) {
		return res.status(400).json('Name and email are required.');
	}

	try {
		// Create the department
		const department = await Department.create({
			ownerId,
			name,
			description,
			email,
			phone,
		});
		res.status(201).json(department);
	} catch (error) {
		// Handle unique constraint
		if (error.name === 'SequelizeUniqueConstraintError') {
			return next(
				res
					.status(400)
					.json('A department with this name or email or phone already exists.')
			);
		}

		next(error);
	}
};

// Get all departments
const findAllDepartments = async (req, res, next) => {
	try {
		const departments = await Department.findAll({
			attributes: ['ownerId', 'id', 'description', 'email', 'phone'],
		});
		if (!departments) {
			return res.status(404).json('No departments found.');
		}
		res.status(200).json(departments);
	} catch (error) {
		next(error);
	}
};

// Get a department by ID
const findDepartmentById = async (req, res, next) => {
	try {
		const department = await Department.findByPk(req.params.id, {
			attributes: ['ownerId', 'id', 'description', 'email', 'phone'],
		});
		if (!department) {
			return res.status(404).json('Department not found.');
		}
		res.status(200).json(department);
	} catch (error) {
		next(error);
	}
};

// Update a department
const updateDepartment = async (req, res, next) => {
	const { ownerId, name, description, email, phone } = req.body;

	try {
		const [updated] = await Department.update(
			{ ownerId, name, description, email, phone },
			{
				where: { id: req.params.id },
				returning: true,
			}
		);

		if (updated === 0) {
			return res.status(404).json('Department not found.');
		}

		const updatedDepartment = await Department.findByPk(req.params.id, {
			attributes: ['ownerId', 'id', 'description', 'email', 'phone'],
		});
		res.status(200).json(updatedDepartment);
	} catch (error) {
		// Handle unique constraint errors
		if (error.name === 'SequelizeUniqueConstraintError') {
			return next(
				res
					.status(400)
					.json('A department with this name or email already exists.')
			);
		}
		next(error);
	}
};

// Delete a department
const deleteDepartment = async (req, res, next) => {
	try {
		const deleted = await Department.destroy({
			where: { id: req.params.id },
		});
		if (deleted === 0) {
			return res.status(404).json('Department not found.');
		}
		res.status(200).json({ message: 'Department deleted successfully.' });
	} catch (error) {
		next(error);
	}
};

module.exports = {
	createDepartment,
	findAllDepartments,
	findDepartmentById,
	updateDepartment,
	deleteDepartment,
};
