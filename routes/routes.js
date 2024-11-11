const express = require('express');
const router = express.Router();
const routesController = require('../controllers/routesController');

router.post('/truck-route', routesController.getTruckRoute);

module.exports = router;

