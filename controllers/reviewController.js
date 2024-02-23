const utilities = require("../utilities/")
const reviewModel = require("../models/review-model")
const revConst = {}

/* ***************************
 *  Build add review view
 * ************************** */
revConst.addReview = async function (req, res) {
    const { review_text, account_id, inv_id } = req.body

    const regResult = await reviewModel.addReview(review_text, inv_id, account_id)
    
    if(regResult) {
        res.redirect(`/inv/detail/${inv_id}`)
    } else {
        req.flash(
            "notice",
            "sorry, the adition failed."
        )
        res.redirect(`/inv/detail/${inv_id}`)
    }
}

/* ***************************
 *  Build update review view
 * ************************** */
revConst.buildEditReview = async function (req, res, next) {
    const review_id = parseInt(req.params.review_id)
    let nav = await utilities.getNav()
    const reviewData = await reviewModel.getReviewByReviewId(review_id)
    const itemName = `${reviewData[0].inv_year} ${reviewData[0].inv_make} ${reviewData[0].inv_model}`
    res.render("./review/edit-review", {
        title: "Edit " + itemName + " Review",
        nav,
        errors: null,
        review_date: reviewData[0].review_date,
        review_text: reviewData[0].review_text,
        review_id: reviewData[0].review_id
    })
}

/* ***************************
 *  Update Review Data
 * ************************** */
revConst.updateReview = async function (req, res, next) {
    let nav = await utilities.getNav()
    const { review_text, review_id } = req.body

    const reviewData = await reviewModel.getReviewByReviewId(review_id)
    const itemName = `${reviewData[0].inv_year} ${reviewData[0].inv_make} ${reviewData[0].inv_model}`

    const updateResult = await reviewModel.updateReview(review_id, review_text)

    console.log(updateResult)

    if (updateResult) {
        req.flash(
            "notice",
            "The review was successfully updated."
        )
        res.redirect("/account/")
    } else {
        req.flash("notice", "Sorry, the update failed.")
        res.status(501).render("./review/edit-review", {
            title: "Edit " + itemName + " Review",
            nav,
            errors: null,
            review_date: reviewData[0].review_date,
            review_text,
            review_id
        })
    }
}

/* ***************************
 *  Build delete review view
 * ************************** */
revConst.buildDeleteView = async function (req, res, next) {
    const review_id = parseInt(req.params.review_id)
    let nav = await utilities.getNav()
    const reviewData = await reviewModel.getReviewByReviewId(review_id)
    const itemName = `${reviewData[0].inv_year} ${reviewData[0].inv_make} ${reviewData[0].inv_model}`
    res.render("./review/delete-confirmation", {
        title: "Delete " + itemName + " Review",
        nav,
        errors: null,
        review_date: reviewData[0].review_date,
        review_text: reviewData[0].review_text,
        review_id: reviewData[0].review_id
    })
}

/* ***************************
 *  Delete Review Data
 * ************************** */
revConst.deleteReview = async function (req, res, next) {
    const { review_id } = req.body
    console.log(review_id)

    const deleteResult = await reviewModel.deleteReview(review_id)
    console.log(deleteResult)

    if (deleteResult) {
        req.flash("notice", "The review was successfully deleted.")
        res.redirect("/account/")
    } else {
        req.flash("notice", "Sorry, the delete failed.")
        res.redirect(`/review/delete/${review_id}`)
    }
}

module.exports = revConst