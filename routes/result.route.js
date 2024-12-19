const router = require('express').Router();
const authUser = require('../middleware/authUser.js');
const authAdmin = require('../middleware/authAdmin.js');

const {
	createResult,
	findAllResults,
	findResultById,
	updateResult,
	deleteResult,
} = require('../controllers/result.controller.js');

router.post('/', createResult);
router.get('/', findAllResults);
router.get('/:id', findResultById);
router.put('/:id', updateResult);
router.delete('/:id', deleteResult);

module.exports = router;
