// productImageRoutes.js
const express = require('express');
const router = express.Router();
const productImageController = require('../controllers/controllers');

// Create a new product image
router.post('/',
    productImageController.createProductImage);

// Get product image by ID
router.get('/:productId',
    productImageController.getProductImageByProductId);

//Update image url by product id 
router.put('/:productId',
    productImageController.updateProductUrlImage)
// Delete product image by ID
router.delete('/:productId',
    productImageController.deleteProductImageByProductId);

module.exports = router;
