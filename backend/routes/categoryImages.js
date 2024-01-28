// routes.js

const express = require('express');
const router = express.Router();
const categoryImagesController = require('../controllers/controllers');

// Define a route to create a category image
router.post('/category-images',
    categoryImagesController.createCategoryImage);

// a route to get category image by category id 
router.get('/:id',
    categoryImagesController.getCategoryImageByCategoryId);
    
module.exports = router;
