//! productRoutes.js
const express = require('express');
const router = express.Router();
const productController = require('../controllers/controllers');

//! Create a new product
router.post('/',
    productController.createProduct);

//! Get all products
router.get('/',
    productController.getAllProduct);

//!get last 3 products 
router.get("/get-last-three",
    productController.getLastProducts);

//! Get product by name
router.get('/get/:name'
    ,productController.getProductByName);

//!Get product by id
router.get('/get-product/:id'
    ,productController.getProductById);

//!Get product by pack id
router.get('/get-by-pack/:id',
productController.getProductByPackId);

//!Get product by category id
router.get('/get-by-category/:id',
productController.getProductByCategoryId);

//! Update product by id
router.put('/update-status/:id',
    productController.updateProductStatus);

//! Update product by id
router.put('/update-discount/:id',
    productController.updateProductDiscount);
//! Delete product by id
router.delete('/:id',
    productController.deleteProduct);

module.exports = router;

//!test done 