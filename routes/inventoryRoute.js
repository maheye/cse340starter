// Needed Resources 
const express = require("express")
const router = new express.Router() 
const invController = require("../controllers/invController")
const baseController = require("../controllers/baseController")
const utilities = require("../utilities/")
const regValidate = require("../utilities/inventory-validation")

// Route to build inventory by classification view
router.get("/type/:classificationId", invController.buildByClassificationId);

// Route to build vehicle details by vehicle details view
router.get("/detail/:inventoryId", utilities.handleErrors(invController.buildByInventoryId));

// Route to build management view
router.get("/", utilities.checkAccountType, utilities.handleErrors(invController.buildManagement));

// Route to build add classification view
router.get("/add-classification", utilities.checkAccountType, utilities.handleErrors(invController.buildAddClassification));

// Route to build add classification view
router.get("/add-inventory", utilities.checkAccountType, utilities.handleErrors(invController.buildAddInventory));

// Process the new classification data
router.post(
    "/addClassification",
    regValidate.addClassificationRules(),
    regValidate.checkAddClassificationData, 
    utilities.handleErrors(invController.registerClassification))

// Route to build add vehicle view
router.get("/addVehicle", utilities.checkLogin, utilities.checkAccountType ,utilities.handleErrors(invController.buildAddVehicle))

// Process the new vehicle data
router.post(
    "/addVehicle",
    regValidate.addVehicleRules(),
    regValidate.checkAddVehicleRules,
    utilities.handleErrors(invController.registerVehicle))

// Route to build inventory by classification view for management view
router.get("/getInventory/:classification_id", utilities.handleErrors(invController.getInventoryJSON))

//Route to build the update view
router.get("/edit/:inv_id", utilities.checkLogin, utilities.checkAccountType ,utilities.handleErrors(invController.editInventoryView))

// Process the update vehicle data
router.post(
    "/update/",
    regValidate.addVehicleRules(),
    regValidate.checkUpdateData,
    utilities.handleErrors(invController.updateInventory))

// Route to build the delete view
router.get("/delete/:inv_id", utilities.checkLogin, utilities.checkAccountType ,utilities.handleErrors(invController.buildDeleteView))

// Process the delete inventory request
router.post("/delete", utilities.handleErrors(invController.deleteItem))

// 500 Error Route
router.get("/broken", utilities.handleErrors(baseController.buildFooter))

// 500 Error Route
router.get("/broken", utilities.handleErrors(baseController.buildFooter))

module.exports = router;