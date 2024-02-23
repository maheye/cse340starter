const pool = require("../database/index")

// Add new review
async function addReview(review_text, inv_id, account_id) {
    try {
        const sql = "INSERT INTO review (review_text, inv_id, account_id) VALUES ($1, $2, $3) RETURNING *"
        return pool.query(sql, [review_text, inv_id, account_id])
    } catch (error) {
        return error.message
    }
}

// Retrieve reviews by inventory_id
async function getReviewByInventoryId(inv_id) {
    try {
        const data = await pool.query(
            `SELECT account_firstname, account_lastname, review_date, review_text, TO_CHAR(review_date, 'Month DD, YYYY') AS modified_review_date
            FROM account
            JOIN review ON account.account_id = review.account_id
            WHERE review.inv_id = $1
            ORDER BY review_date DESC`,
            [inv_id]
        )
        return data.rows
    } catch (error) {
        return new Error("No matching inventory id found.")
    }
}

// Retrieve reviews by account_id
async function getReviewByAccountId(account_id) {
    try {
        const data = await pool.query(
            `SELECT inv_year, inv_make, inv_model, review_id, TO_CHAR(review_date, 'Month DD, YYYY') AS review_date FROM inventory 
            JOIN review ON inventory.inv_id = review.inv_id 
            WHERE review.account_id = $1`, 
            [account_id]
        )
        return data.rows
    } catch (error) {
        return new Error("No matching account id found.")
    }
}

// Retrieve reviews by review_id
async function getReviewByReviewId(review_id) {
    try {
        const data = await pool.query(
            `SELECT inv_year, inv_make, inv_model, review_id, TO_CHAR(review_date, 'Month DD, YYYY') AS review_date, review_text FROM inventory 
            JOIN review ON inventory.inv_id = review.inv_id 
            WHERE review_id = $1`,
            [review_id]
        )
        return data.rows
    } catch (error) {
        return new Error("No matching review_id found.")
    }
}

// Update Review Data
async function updateReview (review_id, review_text) {
    try {
        const sql = "UPDATE review SET review_text = $1 WHERE review_id = $2"
        const data = await pool.query(sql, [ review_text, review_id ])
        return data.rows
    } catch (error) {
        console.log("Model error: " + error)
    }
}

// Delete Review Data
async function deleteReview(review_id) {
    try {
        const sql = 'DELETE FROM review WHERE review_id = $1'
        const data = await pool.query(sql, [review_id])
        return data
    } catch (error) {
        console.log("Delete Review Error")
    }
}

module.exports = { addReview, getReviewByAccountId, getReviewByReviewId, updateReview, deleteReview, getReviewByInventoryId }