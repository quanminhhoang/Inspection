const router = require('express').Router();

const {
	signin,
	signup,
	signout,
} = require('../controllers/auth.controller.js');

router.post('/signup', signup);
router.post('/signin', signin);
router.get('/signout', signout);

module.exports = router;
