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

invCont.buildByInventoryId = async function (req, res, next) {
  const grid = await utilities.buildVehicleInfoGrid(data)
  let nav = await utilities.getNav()
  const invYear = data[0].inv_year
  const invMake = data[0].inv_make
  const invModel = data[0].inv_model
  res.render("./inventory/vehicle-info", {
      title: invYear + " " + invMake + " " + invModel,
      nav,
      grid,
  })
}

/* ***************************
 *  Build vehicle detail view by inventory id
 * ************************** */
invCont.buildByInventoryId = async function (req, res, next) {
  const inv_id = req.params.inventoryId
  const data = await invModel.getInventoryByInventoryId(inv_id)
  const detailsView = await utilities.buildVehiclesDetailsView(data[0])
  let nav = await utilities.getNav()
  const className = data[0].inv_make
  res.render("./inventory/details", {
    title: className,
    nav,
    detailsView,
  })
}


module.exports = invCont