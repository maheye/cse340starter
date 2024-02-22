const utilities = require(".")
const { body, validationResult } = require("express-validator")
const inventoryModel = require("../models/inventory-model")
const validate = {}

/*  **********************************
 *  Add Vehicle Data Validation Rules
 * ********************************* */
validate.addVehicleRules = () => {
    return [
        // classification name is required
        body("classification_id")
            .trim()
            .isNumeric({ no_symbols: true })
            .withMessage("The classification name is required."),

        // vehicle make is required
        body("inv_make")
            .trim()
            .isLength({ min: 3 })
            .withMessage("The vehicle's make is required."),

        // vehicle model is required
        body("inv_model")
            .trim()
            .isLength({ min: 2})
            .withMessage("The vehicle's model is required."),

        // vehicle description is required
        body("inv_description")
            .trim()
            .isLength({ min: 1 })
            .withMessage("The vehicle's description is required."),

        // vehicle image path is required
        body("inv_image")
            .trim()
            .isLength({ min: 1})
            .withMessage("The image path is required."),

        // vehicle thumbnail path is required
        body("inv_thumbnail")
            .trim()
            .isLength({ min: 1 })
            .withMessage("The thumbnail path is required."),

        // price is required
        body("inv_price")
            .trim()
            .isCurrency()
            .withMessage("The vehicle's price is required."),

        // year is required
        body("inv_year")
            .trim()
            .isInt({ min: 1880, max: `${new Date().getFullYear()}`})
            .withMessage("The vehicle's year is required."),

        // miles is required
        body("inv_miles")
            .trim()
            .isInt({ min: 0})
            .withMessage("The vehicle's miles is required."),

        // color is required
        body("inv_color")
            .trim()
            .isLength({ min: 1 })
            .withMessage("The vehicle's color is required."),       
    ]
}

/* ******************************
 * Check new vehicle data and return errors or continue to addition of vehicle
 * ***************************** */
validate.checkAddVehicleRules = async (req, res, next) => {
    const { classification_id, inv_make, inv_model, inv_description, inv_image, inv_thumbnail, inv_price, inv_year, inv_miles, inv_color } = req.body
    let errors = []
    errors = validationResult(req)
    if (!errors.isEmpty()) {
        let nav = await utilities.getNav()
        let selectList = await utilities.selectList(classification_id)
        res.render("./inventory/add-inventory", {
            errors,
            title: "Add Vehicle",
            nav,
            selectList,
            classification_id, 
            inv_make, 
            inv_model, 
            inv_description, 
            inv_image, 
            inv_thumbnail, 
            inv_price, 
            inv_year, 
            inv_miles, 
            inv_color,
        })
        return
    }
    next()
}

/* ******************************
 * Check update data and return errors or continue to update the vehicle information
 * ***************************** */
validate.checkUpdateData = async (req, res, next) => {
    const { classification_id, inv_make, inv_model, inv_description, inv_image, inv_thumbnail, inv_price, inv_year, inv_miles, inv_color, inv_id } = req.body
    let errors = []
    errors = validationResult(req)
    if (!errors.isEmpty()) {
        let nav = await utilities.getNav()
        let selectList = await utilities.selectList(classification_id)
        res.render("./inventory/edit-inventory", {
            errors,
            title: `Edit ${inv_make} ${inv_model}`,
            nav,
            selectList,
            classification_id, 
            inv_make, 
            inv_model, 
            inv_description, 
            inv_image, 
            inv_thumbnail, 
            inv_price, 
            inv_year, 
            inv_miles, 
            inv_color,
            inv_id,
        })
        return
    }
    next()
}

/*  **********************************
 *  Add Classification Data Validation Rules
 * ********************************* */
validate.addClassificationRules = () => {
    return [
        // classification name is required
        body("classification_name")
            .trim()
            .isLength({ min: 1 })
            .isAlpha('en-US')
            .withMessage("Classification name is required.")
            .custom(async (classification_name) => {
                const classificationNameExists = await inventoryModel.checkExistingClassificationName(classification_name)
                if (classificationNameExists) {
                    throw new Error("Classification name already exists. Please use a different name.")
                }
            }),
    ]
}

/* ******************************
 * Check new classification data and return errors or continue to addition of classification name
 * ***************************** */
validate.checkAddClassificationData = async (req, res, next) => {
    const { classification_name } = req.body
    let errors = []
    errors = validationResult(req)
    if(!errors.isEmpty()) {
        let nav = await utilities.getNav()
        res.render("./inventory/add-classification", {
            errors,
            title: "Add Classification",
            nav,
            classification_name,
        })
        return
    }
    next()
}

module.exports = validate