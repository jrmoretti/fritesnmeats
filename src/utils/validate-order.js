const VALID_ORDERS = ['addOrder', 'order', 'orderFor'];

module.exports = function(order) {
  if (VALID_ORDERS.includes(order)) {
    return true;
  } else {
    throw new Error(`could not parse this order: ${order}`);
  }
}
