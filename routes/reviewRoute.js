// Needed Resources
const express = require("express")
const router = new express.Router()
const utilities = require("../utilities/")
const reviewController = require("../controllers/reviewController")
const reviewValidate = require("../utilities/review-validation")

// New review request
router.post(
    "/addReview",
    reviewValidate.addReviewRules(),
    reviewValidate.checkAddReviewRules,
    utilities.handleErrors(reviewController.addReview))

// Build edit review view
router.get("/update/:review_id", utilities.handleErrors(reviewController.buildEditReview))

// Edit review request
router.post(
    "/update/",
    reviewValidate.addReviewRules(),
    reviewValidate.checkUpdateReviewData,
    utilities.handleErrors(reviewController.updateReview))

// Build delete review view
router.get("/delete/:review_id", utilities.handleErrors(reviewController.buildDeleteView))

// Delete review request
router.post("/delete/", utilities.handleErrors(reviewController.deleteReview))

module.exports = router;