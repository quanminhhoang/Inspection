const router = require('express').Router();
const authUser = require('../middleware/authUser.js');
const authAdmin = require('../middleware/authAdmin.js');

const {
	createDepartment,
	findAllDepartments,
	findDepartmentById,
	updateDepartment,
	deleteDepartment,
} = require('../controllers/department.controller.js');

router.post('/', createDepartment);
router.get('/', findAllDepartments);
router.get('/:id', findDepartmentById);
router.put('/:id', updateDepartment);
router.delete('/:id', deleteDepartment);

module.exports = router;
