const utilities = require(".")
const reviewModel = require("../models/review-model")
const invModel1 = require("../models/inventory-model")
const { body, validationResult } = require("express-validator")
const validate = {}

/*  **********************************
 *  Add Review Data Validation Rules
 * ********************************* */
validate.addReviewRules = () => {
    return [
        // vehicle description is required
        body("review_text")
            .trim()
            .isLength({ min: 1 })
            .withMessage("The review text is required."),
    ]
}

validate.checkAddReviewRules = async (req, res, next) => {
    const { review_text, inv_id, account_id } = req.body
    let errors = []
    errors = validationResult(req)
    console.log(errors)
    if (!errors.isEmpty()) {
        const data = await invModel1.getVehicleInfoByInventoryId(inv_id)
        const grid = await utilities.buildVehicleInfoGrid(data)
        const reviewData = await reviewModel.getReviewByInventoryId(inv_id)
        console.log(reviewData)
        const reviewGrid = await utilities.buildCustomerReviewGrid(reviewData)
        let nav = await utilities.getNav()
        const invYear = data[0].inv_year
        const invMake = data[0].inv_make
        const invModel = data[0].inv_model
        res.render("./inventory/vehicle-info", {
            title: invYear + " " + invMake + " " + invModel,
            nav,
            errors,
            grid,
            reviewGrid,
            inv_id
        })
        return
    }
    next()
}

/* ******************************
 * Check update data and return errors or continue to update the review
 * ***************************** */
validate.checkUpdateReviewData = async (req, res, next) => {
    const { review_text, review_id, review_date } = req.body
    console.log(req.body)
    let errors = []
    errors = validationResult(req)
    if (!errors.isEmpty()) {
        let nav = await utilities.getNav()
        const reviewData = await reviewModel.getReviewByReviewId(review_id)
        const itemName = `${reviewData[0].inv_year} ${reviewData[0].inv_make} ${reviewData[0].inv_model}`
        res.render("./review/edit-review", {
            title: "Edit " + itemName + " Review",
            errors,
            nav,
            review_text,
            review_id,
            review_date,
        })
        return
    }
    next()
}

module.exports = validate