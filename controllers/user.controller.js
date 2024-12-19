const bcryptjs = require('bcryptjs');

const db = require('../models/index.model.js');
const User = db.user;
const Op = db.Op;

const updateUser = async (req, res, next) => {
	const { email, fullname, phone, password } = req.body;

	if (password) {
		if (password.length < 6) {
			return res.status(400).json('Password must be at least 6 characters');
		}
		password = bcryptjs.hashSync(password, 10);
	}

	try {
		const user = await User.findByPk(req.params.id);

		if (!user) {
			return res.status(404).json('User not found');
		}

		await User.update(
			{
				email,
				fullname,
				phone,
				password: password || undefined,
			},
			{
				where: { id: req.params.id },
				returning: true,
			}
		);

		const updatedUser = await User.findOne({ where: { id: req.params.id } });

		return res.status(200).json(updatedUser);
	} catch (error) {
		if (error.name === 'SequelizeUniqueConstraintError') {
			return res.status(400).json('Phone or Email already in use.');
		}
		next(error);
	}
};

const deleteUser = async (req, res, next) => {
	try {
		const deleted = await User.destroy({
			where: { id: req.params.id },
		});

		if (deleted === 0) {
			return res.status(404).json('User not found');
		}

		return res.status(200).json('User has been deleted');
	} catch (error) {
		next(error);
	}
};

const findById = async (req, res, next) => {
	try {
		const user = await User.findByPk(req.params.id, {
			attributes: { exclude: ['password'] },
		});

		if (!user) {
			return res.status(404).json('User not found');
		}

		return res.status(200).json(user);
	} catch (error) {
		next(error);
	}
};

const findByUsername = async (req, res, next) => {
	try {
		const user = await User.findOne({
			where: { username: req.params.username },
			attributes: { exclude: ['password'] },
		});

		if (!user) {
			return res.status(404).json('User not found');
		}

		return res.status(200).json(user);
	} catch (error) {
		next(error);
	}
};

const findAll = async (req, res, next) => {
	try {
		const users = await User.findAll();

		if (!users) {
			return res.status(404).json('User not found');
		}
		return res.status(200).json(users);
	} catch (err) {
		next(error);
	}
};

module.exports = { findByUsername, findById, deleteUser, updateUser, findAll };
