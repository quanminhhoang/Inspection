const router = require('express').Router();
const authUser = require('../middleware/authUser.js');
const authAdmin = require('../middleware/authAdmin.js');

const {
	createVehicle,
	findVehicleById,
	findVehicleByPlate,
	deleteVehicle,
	updateVehicle,
	findAllVehicles,
	viewVehicleStatistics,
	viewExpireVehicles,
} = require('../controllers/vehicle.controller.js');

router.post('/', createVehicle);
router.put('/:id', updateVehicle);
router.get('/:id', findVehicleById);
router.get('/', findAllVehicles);
router.delete('/:id', deleteVehicle);
router.get('/plate/:plate', findVehicleByPlate);
router.get('/report/stat', viewVehicleStatistics);
router.get('/report/expire', viewExpireVehicles);

module.exports = router;
