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

router.get('/findByUsername/:username', authUser, findByUsername);
router.get('/', authAdmin, findAll);
router.get('/:id', authUser, findById);

router.put('/:id', authAdmin, updateUser);
router.delete('/:id', authAdmin, deleteUser);

module.exports = router;
