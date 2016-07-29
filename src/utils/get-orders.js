const fs = require('fs');

module.exports = function() {
  let ORDERS = {};
  try {
    ORDERS = require('./constants');
  } catch(e) {
    console.log(e)
    fs.writeFileSync(`${__dirname}/constants.js`, `module.exports = ${JSON.stringify({})};`);
  }

  return ORDERS;
}
