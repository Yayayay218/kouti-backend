var express = require('express');

var router = express.Router();

var ctrlLocker = require('../controllers/lockers.controller');
var ctrlOrder = require('../controllers/orders.controller');
var ctrlHub = require('../controllers/hub.controller');
var ctrlCu = require('../controllers/cu.controller');

//  Locker APIs
router.get('/lockers', ctrlLocker.lockerGetAll);
router.get('/lockers/:id', ctrlLocker.lockerGetOne);
router.post('/lockers', ctrlLocker.lockerPOST);
router.put('/lockers/:id', ctrlLocker.lockerPUT);
router.delete('/lockers/:id', ctrlLocker.lockerDEL);

//  Order APIs
router.get('/orders', ctrlOrder.orderGetAll);
router.get('/orders/:id', ctrlOrder.orderGetOne);
router.post('/orders', ctrlOrder.orderPOST);
router.put('/orders/:id', ctrlOrder.orderPUT);
router.delete('/orders/:id', ctrlOrder.orderDEL);

//  Hubs APIs
router.get('/hubs', ctrlHub.hubGetAll);
router.get('/hubs/:id', ctrlHub.hubGetOne);
router.post('/hubs', ctrlHub.hubPOST);
router.put('/hubs/:id', ctrlHub.hubPUT);
router.delete('/hubs/:id', ctrlHub.hubDEL);

//  CU APIs
router.get('/cus', ctrlCu.cuGetAll);
router.get('/cus/:id', ctrlCu.cuGetOne);
router.post('/cus', ctrlCu.cuPOST);
router.put('/cus/:id', ctrlCu.cuPUT);
router.delete('/cus/:id', ctrlCu.cuDEL);

module.exports = router;
