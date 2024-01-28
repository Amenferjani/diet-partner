// basketRoutes.js
const express = require('express');
const router = express.Router();
const basketController = require('../controllers/controllers');

// Create a new basket
router.post('/',
    basketController.createBasket);

// Get basket by ID
router.get('/:id',
    basketController.getBasketById);

// update basket by ID
router.put('/:id/update-total-amount',
    basketController.updateBasketTotalAmount);

// Delete basket by ID
router.delete('/:id',
    basketController.deleteBasket);

module.exports = router;
//!test done 