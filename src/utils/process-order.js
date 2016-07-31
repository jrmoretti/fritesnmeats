const ORDERS = require('./get-orders')();
const fs = require('fs');
const mailer = require('nodemailer');
const moment = require('moment-timezone');

const smtpConfig = {
  host: 'smtp.gmail.com',
  port: 465,
  secure: true,
  auth: {
    user: process.env.MY_EMAIL,
    pass: process.env.FNMP
  }
};

const mailOpts = {
  from: process.env.MY_EMAIL,
  to: process.env.PHONE_NUMBER,
  subject: 'Food Order',
};

const transporter = mailer.createTransport(smtpConfig);

module.exports = function(userName, order, orderInfo, resp) {
  switch (order) {
    case 'addOrder':
      return addOrder(userName, orderInfo, resp);
    case 'order':
      return makeOrder(userName, resp);
    case 'orderFor':
      return makeMultipleOrders(orderInfo, resp);
    case 'alias':
      return makeAlias(userName, orderInfo, resp);
    default:
      throw new Error(`unknown order: ${order}`);
  }
}

function addOrder (userName, orderInfo, resp) {
  const userExists = ORDERS[userName];

  if (userExists) {
    ORDERS[userName].orderInfo = orderInfo;
  } else {
    ORDERS[userName] = { orderInfo };
  }

  updateOrders();
  resp.status(200).send('Success. You can now make an order with `/fritesnmeats order`');
}


function makeOrder(userName, resp) {
  const order = ORDERS[userName] && ORDERS[userName].orderInfo;
  if (!order) {
    return resp.status(400).send('You must first register an order with /fritesnmeats addOrder [order]');
  }

  const lastOrdered = ORDERS[userName].ordered;
  const lastOrderedMoment = lastOrdered && moment.tz(lastOrdered, 'America/New_York');
  const today = moment.tz('America/New_York');
  const userOrderedToday = lastOrderedMoment && today.diff(lastOrderedMoment, 'days') === 0;

  if (userOrderedToday) {
    return resp.status(400).send('You already made an order today');
  }

  mailOpts.text = order;
  mailOpts.subject = `Food Order for ${ORDERS[userName].alias || userName}`;
  transporter.sendMail(mailOpts, function(err, info) {
    if (err) {
      console.log('Error: ', err);
      resp.status(400).send('Could not make order :(');
    } else {
      ORDERS[userName].ordered = moment.tz('America/New_York').format('YYYY-MM-DD');
      resp.status(200).send(`You just ordered ${order}`);
      updateOrders();
    }
  });
}

function makeAlias(userName, alias, resp) {
  if (!ORDERS[userName]) {
    return resp.status(400).send('You need to create an order first with /fritesnmeats addOrder');
  }

  ORDERS[userName].alias = alias;
  resp.status(200).send(`Your order will now be sent as ${alias}`);
  updateOrders();
}

function makeMultipleOrders(peopleOrdering, resp) {
  return resp.status(400).send('Not yet supported');
}

function updateOrders() {
  const updatedFile = `module.exports = ${JSON.stringify(ORDERS, null, 2)};`;
  fs.writeFileSync(`${__dirname}/constants.js`, updatedFile);
}
