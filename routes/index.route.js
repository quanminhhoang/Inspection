const router = require('express').Router();

const userRoute = require('./user.route.js');
const authRoute = require('./auth.route.js');
const departmentRoute = require('./department.route.js');
const vehicleRoute = require('./vehicle.route.js');
const resultRoute = require('./result.route.js');

router.use('/user', userRoute);
router.use('/auth', authRoute);
router.use('/department', departmentRoute);
router.use('/vehicle', vehicleRoute);
router.use('/result', resultRoute);

module.exports = router;
