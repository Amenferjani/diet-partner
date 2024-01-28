// basketItemRoutes.js
const express = require('express');
const router = express.Router();
const basketItemController = require('../controllers/controllers');

// Create a new basket item
router.post('/',
    basketItemController.createBasketItem);

// Get basket item by ID
router.get('/:basketId',
    basketItemController.getBasketItemsById);

// Update basket item by ID
router.put('/:id',
    basketItemController.updateBasketItem);

// Delete basket item by ID
router.delete('/:id',
    basketItemController.deleteBasketItem);

module.exports = router;
//!test done