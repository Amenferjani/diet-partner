// packImageRoutes.js
const express = require('express');
const router = express.Router();
const packImageController = require('../controllers/controllers');

// Create a new pack image
router.post('/',
    packImageController.createPackImage);

// Get pack image by pack ID
router.get('/:packId',  
    packImageController.getPackImageByPackId);

//Update pack image by pack ID 
router.put('/:packId',
    packImageController.updatePackUrlImage);

// Delete pack image by pack ID
router.delete('/:packId',
    packImageController.deletePackImage);

module.exports = router;
