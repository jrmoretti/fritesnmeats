const ORDERS = require('./constants');

Object.keys(ORDERS).forEach(user => {
  const usersOrder = ORDERS[user];
  usersOrder.ordered = false;
});

const updatedFile = `module.exports = ${JSON.stringify(ORDERS, null, 2)};`;
fs.writeFileSync(`${__dirname}/constants.js`, updatedFile);
