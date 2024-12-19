const jwt = require('jsonwebtoken');

const authAdmin = (req, res, next) => {
	const token = req.cookies.access_token;
	if (!token) {
		return res.status(401).json('Unauthorized');
	}

	jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
		if (err) {
			return res.status(401).json({ message: 'Unauthorized, invalid token' });
		}

		if (user.isAdmin != true) {
			return res.status(403).json({ message: 'Access denied. Admins only' });
		}
		req.user = user;
		next();
	});
};

module.exports = authAdmin;
