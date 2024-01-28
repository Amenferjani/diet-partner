// categoryRoutes.js
const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/controllers');

// Create a new category
router.post('/',
    categoryController.createCategory);

// Get all categories
router.get('/',
    categoryController.getAllCategories);

// Get category by name
router.get('/:name',
    categoryController.getCategoryByName);

// Delete category by ID
router.delete('/:name',
    categoryController.deleteCategory);

module.exports = router;
//* test done 
