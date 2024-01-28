// packRoutes.js
const express = require('express');
const router = express.Router();
const packController = require('../controllers/controllers');

// Create a new pack
router.post('/',
    packController.createPack);

// Get all packs
router.get('/',
    packController.getAllPacks);

router.get('/get-pack/:id',
    packController.getPackById);

router.get("/get-last-two",
    packController.getLastPacks)
    
// Get pack by name
router.get('/:name',
    packController.getPackByName);

// Update pack name by ID
router.put('/update-name/:id',
    packController.updatePackName);

// Update pack discount by ID
router.put('/update-discount/:id',
    packController.updatePackDiscount);

router.put('/update-status/:id',
    packController.updatePackStatus);

// Delete pack by ID
router.delete('/:id',
    packController.deletePack);

module.exports = router;
//* test done 
