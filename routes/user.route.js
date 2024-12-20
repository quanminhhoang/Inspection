const router = require('express').Router();
const authUser = require('../middleware/authUser.js');
const authAdmin = require('../middleware/authAdmin.js');

const {
	updateUser,
	deleteUser,
	findById,
	findByUsername,
	findAll,
} = require('../controllers/user.controller.js');

router.get('/findByUsername/:username', findByUsername);
router.get('/', findAll);
router.get('/:id', findById);

router.put('/:id', updateUser);
router.delete('/:id', deleteUser);

module.exports = router;
