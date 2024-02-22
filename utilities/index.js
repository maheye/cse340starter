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
      +' on CSE Motors" /></a>'
      grid += '<div class="namePrice">'
      grid += '<hr />'
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
* Build the vehicle information view HTML
* ************************************ */
Util.buildVehicleInfoGrid = async function (data) {
  let grid
  if(data.length > 0) {
      grid = '<div id="inventory-grid">'
      data.forEach(vehicle => {
          grid += '<div>'
          grid += '<img src="' + vehicle.inv_image + '" alt="Image of ' + vehicle.inv_make + ' ' + vehicle.inv_model + '">'
          grid += '</div>'
          grid += '<div>'
          grid += '<h2>' + vehicle.inv_make + ' ' + vehicle.inv_model + ' Details</h2>'
          grid += '<ul>'
          grid += '<li class="colored-backgroung"><strong>Price: </strong><span>$' + new Intl.NumberFormat('en-US').format(vehicle.inv_price) + '</span></li>'
          grid += '<li><strong>Description: </strong>' + vehicle.inv_description + '</li>'
          grid += '<li class="colored-backgroung"><strong>Color: </strong>' + vehicle.inv_color + '</li>'
          grid += '<li><strong> Miles: </strong>' + new Intl.NumberFormat('en-US').format(vehicle.inv_miles) + '</li>'
          grid += '</ul>'
          grid += '</div>'
      })
      grid += '</div>'
  } else {
      grid += '<p class="notice">Sorry, no matching vehicles could be found.</p>'
  }
  return grid
}

/* **************************************
* Build a dynamic drop-down select list
* ************************************ */
Util.selectList = async function (classification_id) {
  let data = await invModel.getClassifications()
  let list = '<select class="lbl-properties classification_id" id="classificationList" name="classification_id" required>'
  list += '<option value="" selected>Choose a classification</option>'
  data.rows.forEach((row) => {
      list += `<option value="${row.classification_id}"`
      if (classification_id) {
          if(row.classification_id == classification_id) {
              list += ' selected '
          }
      }
      list += `>${row.classification_name}</option>`
  })
  list += '</select>'
  return list
}


/* ****************************************
 * Middleware For Handling Errors
 * Wrap other function in this for 
 * General Error Handling
 **************************************** */
Util.handleErrors = fn => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next)

module.exports = Util