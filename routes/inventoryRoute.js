// Needed Resources 
const express = require("express")
const router = new express.Router() 
const invController = require("../controllers/invController")
const baseController = require("../controllers/baseController")
const utilities = require("../utilities/")


// Route to build inventory by classification view
router.get("/type/:classificationId", invController.buildByClassificationId);

// Route to build vehicle details by vehicle details view
router.get("/detail/:inventoryId", utilities.handleErrors(invController.buildByInventoryId));


// 500 Error Route
router.get("/broken", utilities.handleErrors(baseController.buildFooter))

module.exports = router;