const invModel = require("../models/inventory-model")
const utilities = require("../utilities/")

const invCont = {}

/* ***************************
 *  Build inventory by classification view
 * ************************** */
invCont.buildByClassificationId = async function (req, res, next) {
  const classification_id = req.params.classificationId
  const data = await invModel.getInventoryByClassificationId(classification_id)
  const grid = await utilities.buildClassificationGrid(data)
  let nav = await utilities.getNav()
  const className = data[0].classification_name
  res.render("./inventory/classification", {
      title: className + " vehicles",
      nav,
      grid,
  })
}

/* ***************************
*  Build inventory by vehicle info view
* ************************** */
invCont.buildByInventoryId = async function (req, res, next) {
  const inv_id = req.params.inventoryId
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
      errors: null,
      grid,
      reviewGrid,
      inv_id
  })
}

/* ***************************
 *  Build vehicle management view
 * ************************** */
invCont.buildVehicleManagement = async function (req, res, next) {
  let nav = await utilities.getNav()
  let selectList = await utilities.selectList()
  res.render("./inventory/management", {
      title: "Vehicle Management",
      nav,
      errors: null,
      selectList,
  })
}

/* ***************************
 *  Build Add Classification view
 * ************************** */
invCont.buildAddClassification = async function (req, res, next) {
  let nav = await utilities.getNav()
  res.render("./inventory/add-classification", {
    title: "Add Classification",
    nav,
    errors: null,
  })
}

/* ***************************
 *  Build add vehicle view
 * ************************** */
invCont.buildAddVehicle = async function (req, res, next) {
  let nav = await utilities.getNav()
  let selectList = await utilities.selectList()
  res.render("./inventory/add-inventory", {
      title: "Add Vehicle",
      nav,
      selectList,
      errors: null,
  })
}

/* ***************************
 *  Process Add Classification
 * ************************** */
invCont.processAddClassification = async function (req, res) {
  let nav = await utilities.getNav()
  const { classification_name } = req.body
  
  const addResult = await invModel.processAddClassification(
    classification_name
  )

  if (addResult) {
    const classificationSelect = await utilities.buildClassificationDropdown()
    req.flash(
      "notice",
      `Classification ${classification_name} has been added.`
    )
    
      res.status(201).render("inventory/management", {
        title: "Login",
        nav,
        errors: null,
        classificationSelect: classificationSelect,
      }
      )
  } else {
    req.flash("notice", "Adding the classification failed.")
    res.status(501).render("inventory/add-classification", {
      title: "Add Classification",
      nav,
      errors: null,
    })
  }
}

/* ***************************
 *  Build Add Inventory view
 * ************************** */
invCont.buildAddInventory = async function (req, res, next) {
  let nav = await utilities.getNav()
  const dropdown = await utilities.buildClassificationDropdown()
  res.render("./inventory/add-inventory", {
    title: "Add Inventory",
    nav,
    dropdown,
    errors: null,
  })
}

/* ***************************
 *  Process Add Inventory
 * ************************** */
invCont.processAddInventory = async function (req, res) {
  let nav = await utilities.getNav()
  const { inv_make, 
    inv_model, 
    inv_year, 
    inv_description, 
    inv_image, 
    inv_thumbnail, 
    inv_price, 
    inv_miles, 
    inv_color, 
    classification_id } = req.body

  const addResult = await invModel.processAddInventory(
    inv_make, 
    inv_model, 
    inv_year, 
    inv_description, 
    inv_image, 
    inv_thumbnail, 
    inv_price, 
    inv_miles, 
    inv_color, 
    classification_id
  )

  if (addResult) {
    const classificationSelect = await utilities.buildClassificationDropdown()
    req.flash(
      "notice",
      `Vehicle ${inv_make} ${inv_model} has been added.`
    )
      res.status(201).render("inventory/management", {
        title: "Login",
        nav,
        errors: null,
        classificationSelect: classificationSelect,
      }
      )
  } else {
    req.flash("notice", "Adding the vehicle failed.")
    res.status(501).render("inventory/add-inventory", {
      title: "Add Inventory",
      nav,
      errors: null,
    })
  }
}

/* ***************************
 *  Return Inventory by Classification As JSON
 * ************************** */
invCont.getInventoryJSON = async (req, res, next) => {
  const classification_id = parseInt(req.params.classification_id)
  const invData = await invModel.getInventoryByClassificationId(classification_id)
  if (invData[0].inv_id) {
    return res.json(invData)
  } else {
    next(new Error("No data returned"))
  }
}

/* ***************************
 *  Build update view
 * ************************** */
invCont.editInventoryView = async function (req, res, next) {
  const inv_id = parseInt(req.params.inv_id)
  let nav = await utilities.getNav()
  const itemData = await invModel.getVehicleInfoByInventoryId(inv_id)
  const selectList = await utilities.selectList(itemData[0].classification_id)
  const itemName = `${itemData[0].inv_make} ${itemData[0].inv_model}`
  res.render("./inventory/edit-inventory", {
      title: "Edit " + itemName,
      nav,
      selectList: selectList,
      errors: null,
      inv_id: itemData[0].inv_id,
      inv_make: itemData[0].inv_make,
      inv_model: itemData[0].inv_model,
      inv_year: itemData[0].inv_year,
      inv_description: itemData[0].inv_description,
      inv_image: itemData[0].inv_image,
      inv_thumbnail: itemData[0].inv_thumbnail,
      inv_price: itemData[0].inv_price,
      inv_miles: itemData[0].inv_miles,
      inv_color: itemData[0].inv_color,
      classification_id: itemData[0].classification_id
  })
}

/* ***************************
*  Update Inventory Data
* ************************** */
invCont.updateInventory = async function (req, res, next) {
  let nav = await utilities.getNav()
  const {
      inv_id,
      inv_make,
      inv_model,
      inv_description,
      inv_image,
      inv_thumbnail,
      inv_price,
      inv_year,
      inv_miles,
      inv_color,
      classification_id,
  } = req.body
  
  const updateResult = await invModel.updateInventory(
      inv_id,  
      inv_make,
      inv_model,
      inv_description,
      inv_image,
      inv_thumbnail,
      inv_price,
      inv_year,
      inv_miles,
      inv_color,
      classification_id
  )

  if (updateResult) {
      const itemName = updateResult.inv_make + " " + updateResult.inv_model
      req.flash("notice", `The ${itemName} was successfully updated.`)
      res.redirect("/inv/")
  } else {
      const selectList = await utilities.selectList(classification_id)
      const itemName = `${inv_make} ${inv_model}`
      req.flash("notice", "Sorry, the update failed.")
      res.status(501).render("inventory/edit-inventory", {
          title: "Edit " + itemName,
          nav,
          selectList: selectList,
          errors: null,
          inv_id,
          inv_make,
          inv_model,
          inv_year,
          inv_description,
          inv_image,
          inv_thumbnail,
          inv_price,
          inv_miles,
          inv_color,
          classification_id
      })
  }
}

/* ***************************
*  Build delete confirmation view
* ************************** */
invCont.buildDeleteView = async function (req, res, next) {
  const inv_id = parseInt(req.params.inv_id)
  let nav = await utilities.getNav()
  const itemData = await invModel.getVehicleInfoByInventoryId(inv_id)
  const itemName = `${itemData[0].inv_make} ${itemData[0].inv_model}`
  res.render("./inventory/delete-confirm", {
      title: "Delete " + itemName,
      nav,
      errors: null,
      inv_id: itemData[0].inv_id,
      inv_make: itemData[0].inv_make,
      inv_model: itemData[0].inv_model,
      inv_year: itemData[0].inv_year,
      inv_price: itemData[0].inv_price,
  })
}

/* ***************************
*  Delete Item Data
* ************************** */
invCont.deleteItem = async function (req, res, next) {
  // let nav = await utilities.getNav()
  const inv_id = parseInt(req.body.inv_id)
  
  const deleteResult = await invModel.deleteInventoryItem(inv_id)

  if (deleteResult) {
      req.flash("notice", `The vehicle was successfully deleted.`)
      res.redirect("/inv/")
  } else {
      req.flash("notice", "Sorry, the delete failed.")
      res.redirect(`/inv/delete/${inv_id}`)
  }
}

module.exports = invCont