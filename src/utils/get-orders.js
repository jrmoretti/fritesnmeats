const fs = require('fs');

module.exports = function() {
  let ORDERS = {};
  try {
    ORDERS = require('./constants');
  } catch(e) {
    console.log(e);
    const destination = `${__dirname}/constants.js`;
    const content = `module.exports = ${JSON.stringify({})};`;
    fs.writeFileSync(destination, content);
  }

  return ORDERS;
}
