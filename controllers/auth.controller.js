const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');

const db = require('../models/index.model.js');
const User = db.user;
const Op = db.Op;

const signup = async (req, res, next) => {
	const { username, email, fullname, phone, password } = req.body;

	if (
		!username ||
		!email ||
		!password ||
		!fullname ||
		!phone ||
		username === '' ||
		email === '' ||
		password === '' ||
		fullname === '' ||
		phone === ''
	) {
		return res.status(404).json('All fields are required');
	}

	try {
		const existingUser = await User.findOne({
			where: { [Op.or]: [{ username }] },
		});

		if (existingUser) {
			return res.status(404).json('Username or email already exists');
		}

		// Hash
		const hashedPassword = bcryptjs.hashSync(password, 10);

		const newUser = await User.create({
			username,
			email,
			fullname,
			phone,
			password: hashedPassword,
		});

		return res
			.status(201)
			.json({ message: 'Signup successful', user: newUser });
	} catch (error) {
		next(error);
	}
};

const signin = async (req, res, next) => {
	const { username, password } = req.body;

	if (!username || !password || username === '' || password === '') {
		res.status(400).json('All fields are required');
	}

	try {
		const validUser = await User.findOne({
			where: { username },
			attributes: ['password', 'id', 'isAdmin'],
		});

		if (!validUser) {
			return res.status(404).json('User not found');
		}

		const validPassword = bcryptjs.compareSync(password, validUser.password);
		if (!validPassword) {
			return res.status(400).json('Wrong password');
		}

		const token = jwt.sign(
			{ id: validUser.id, isAdmin: validUser.isAdmin },
			process.env.JWT_SECRET,
			{ expiresIn: '1h' } // Expiration time
		);

		res
			.status(200)
			.cookie('access_token', token, {
				httpOnly: true,
			})
			.json({
				token: token,
				_id: validUser._id,
				isAdmin: validUser.isAdmin,
			});
	} catch (error) {
		next(error);
	}
};

const signout = (req, res, next) => {
	try {
		res
			.clearCookie('access_token')
			.status(200)
			.json('User has been signed out');
	} catch (error) {
		next(error);
	}
};

module.exports = { signin, signup, signout };
