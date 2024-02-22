const invModel = require("../models/inventory-model")
const Util = {}

/* ************************
 * Constructs the nav HTML unordered list
 ************************** */
Util.getNav = async function (req, res, next) {
  let data = await invModel.getClassifications()
  let list = "<ul>"
  list += '<li><a href="/" title="Home page">Home</a></li>'
  data.rows.forEach((row) => {
    list += "<li>"
    list +=
      '<a href="/inv/type/' +
      row.classification_id +
      '" title="See our inventory of ' +
      row.classification_name +
      ' vehicles">' +
      row.classification_name +
      "</a>"
    list += "</li>"
  })
  list += "</ul>"
  return list
}


/* **************************************
* Build the classification view HTML
* ************************************ */
Util.buildClassificationGrid = async function(data){
  let grid
  if(data.length > 0){
    grid = '<ul id="inv-display">'
    data.forEach(vehicle => { 
      grid += '<li>'
      grid +=  '<a href="../../inv/detail/'+ vehicle.inv_id 
      + '" title="View ' + vehicle.inv_make + ' '+ vehicle.inv_model 
      + 'details"><img src="' + vehicle.inv_thumbnail 
      +'" alt="Image of '+ vehicle.inv_make + ' ' + vehicle.inv_model 
      +' on CSE Motors"></a>'
      grid += '<div class="namePrice">'
      grid += '<hr>'
      grid += '<h2>'
      grid += '<a href="../../inv/detail/' + vehicle.inv_id +'" title="View ' 
      + vehicle.inv_make + ' ' + vehicle.inv_model + ' details">' 
      + vehicle.inv_make + ' ' + vehicle.inv_model + '</a>'
      grid += '</h2>'
      grid += '<span>$' 
      + new Intl.NumberFormat('en-US').format(vehicle.inv_price) + '</span>'
      grid += '</div>'
      grid += '</li>'
    })
    grid += '</ul>'
  } else { 
    grid += '<p class="notice">Sorry, no matching vehicles could be found.</p>'
  }
  return grid
}

/* **************************************
* Build the vehicle detail view HTML
* ************************************ */
Util.buildVehiclesDetailsView = function(data){
  let detailsView
  if(data){
    let miles = data.inv_miles.toLocaleString("en-US");
    let priceFormatter = Intl.NumberFormat('en-US'); 

    detailsView = '<div id="vehicle-details-container">'
    detailsView += '<div id="vehicle-img-stats-container">'
    detailsView += '<img alt="vehicle image of' + data.inv_model + data.inv_make +'" src="'+ data.inv_thumbnail +'">'
    detailsView += '<ul id="vehicle-details-list">'
    detailsView += '<li> Model Year: ' + data.inv_model + '</li>'
    detailsView += '<li> Make: ' + data.inv_make + '</li>'
    detailsView += '<li> Milage: ' + miles + '</li>'
    detailsView += '<li> Price: $' + priceFormatter.format(data.inv_price) + '</li>'
    detailsView += '</ul>'
    detailsView += '</div>'
    detailsView += '<section>'
    detailsView += '<h2>Description</h2>'
    detailsView += '<p>' + data.inv_description + '</p>'
    detailsView += '</section>'
    detailsView += '</div>'
  }
  return detailsView
}

/* **************************************
* Build the classification id dropdown list 
* for the add inventory form
* ************************************ */
Util.buildClassificationDropdown = async function (req, res, next) {
  const data = await invModel.getClassifications()
  console.log(data)
  let dropdownList = '<label for="classification_id">Classification:</label>'
  dropdownList += '<select name="classification_id" id="classification_id" required>'
  dropdownList += '<option value="" disabled selected hidden>Choose a classification</option>'
  if(data) {
    data.rows.forEach((row) => {
      dropdownList += '<option value="'+ row.classification_id +'">' + row.classification_name+ '</option>'
    })
  }
  dropdownList += '</select><br>'
  console.log(dropdownList)
  return dropdownList
}

/* **************************************
* Build the inventory dropdown list 
* for the review 
* ************************************ */
Util.buildInventoryDropdown = async function (req, res, next) {
  const data = await invModel.getInventory()
  //console.log(data)
  let dropdownList = '<label for="inv_id">Vehicle:</label>'
  dropdownList += '<select name="inv_id" id="inv_id" required>'
  dropdownList += '<option value="" selected hidden>Choose a vehicle</option>'
  if(data) {
    data.rows.forEach((row) => {
      dropdownList += '<option value="'+ row.inv_id +'">'+ row.inv_make + " " + row.inv_model+ '</option>'
    })
  }
  dropdownList += '</select><br>'
  //console.log(dropdownList)
  return dropdownList
}

/* ****************************************
 * Middleware For Handling Errors
 * Wrap other function in this for 
 * General Error Handling
 **************************************** */
Util.handleErrors = fn => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next)

module.exports = Util