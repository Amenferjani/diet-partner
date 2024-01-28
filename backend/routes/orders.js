// orderRoutes.js
const express = require('express');
const router = express.Router();
const orderController = require('../controllers/controllers');

// Create a new order
router.post('/',
    orderController.createOrder);

// Get order by reference
router.get('/:reference',
    orderController.getOrderByReference);

router.get('/',
    orderController.getAllOrders)

// Delete order by id
router.delete('/:reference',
    orderController.deleteOrder);

module.exports = router;
