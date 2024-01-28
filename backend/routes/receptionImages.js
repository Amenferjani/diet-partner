const express = require('express');
const router = express.Router();
const imageController = require('../controllers/controllers');

//!create new image 
router.post("/",
    imageController.createReceptionImage);

//!get all images 
router.get("/",
    imageController.getAllImagesUrl);

//!update display column 
router.put("/:key",
    imageController.updateReceptionImageDisplay);

//!get image with display 
router.get('/display',
    imageController.getImageWithDisplayValue);

//!delete image
router.delete('/delete/:key',
    imageController.deleteImageByKey);
module.exports = router;
