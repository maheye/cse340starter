const express = require("express")
const router = new express.Router() 
const utilities = require("../utilities")
const accountController = require("../controllers/accountController")
const regValidate = require('../utilities/account-validation')



// Route to build login view
router.get("/login", utilities.handleErrors(accountController.buildLogin))

// Route to build registration view
router.get("/register", utilities.handleErrors(accountController.buildRegister))

// Process the registration data
router.post(
    "/register",
    regValidate.registationRules(),
    regValidate.checkRegData,
    utilities.handleErrors(accountController.registerAccount)
  )

// Process the login request
router.post(
  "/login",
  regValidate.loginRules(),
  regValidate.checkLoginData,
  utilities.handleErrors(accountController.accountLogin)
)
// Build update account view
router.get("/update/:account_id", utilities.handleErrors(accountController.buildUpdateAccount))

// Process the update account data
router.post(
  "/update/",
  regValidate.UpdateAccountRules(),
  regValidate.checkUpdateAccountData,
  utilities.handleErrors(accountController.updateAccount)
)

// Route to build the account management view
router.get("/", utilities.checkLogin , utilities.handleErrors(accountController.buildAccountManagement))

/* ***********************
 * Route to update account password
 *************************/
router.post(
  "/update-password/",
  regValidate.changePasswordRules(),
  regValidate.checkUpdateAccountData,
  utilities.handleErrors(accountController.changePassword)
 )

/* ***********************
 * Route to logout
 *************************/
router.get("/logout", utilities.checkLogin, utilities.handleErrors(accountController.buildLogoutView))

/* ***********************
 * Process logout
 *************************/
router.post("/logout", utilities.logout, utilities.handleErrors(accountController.processLogout))

module.exports = router