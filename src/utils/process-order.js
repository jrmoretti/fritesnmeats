const ORDERS = require('./get-orders')();
const fs = require('fs');
const mailer = require('nodemailer');

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
    default:
      throw new Error(`unknown order: ${order}`);
  }
}

function addOrder (userName, orderInfo, resp) {
  ORDERS[userName] = {
    orderInfo,
    ordered: false
  };
  updateOrders();
  resp.status(200).send('Success. You can now make an order with `/fritesnmeats order`');
}


function makeOrder(userName, resp) {
  const order = ORDERS[userName] && ORDERS[userName].orderInfo;
  if (!order) {
    return resp.status(400).send('You must first register an order with /fritesnmeats addOrder [order]');
  }

  if (ORDERS[userName].ordered) {
    return resp.status(400).send('You already made an order today');
  }

  mailOpts.text = order;
  transporter.sendMail(mailOpts, function(err, info) {
    if (err) {
      console.log('Error: ', err);
      resp.status(400).send('Could not make order :(');
    } else {
      ORDERS[userName].ordered = true;
      resp.status(200).send(`You just ordered ${order}`);
      updateOrders();
    }
  });
}

function makeMultipleOrders(peopleOrdering, resp) {
  return resp.status(400).send('Not yet supported');
}

function updateOrders() {
  const updatedFile = `module.exports = ${JSON.stringify(ORDERS, null, 2)};`;
  fs.writeFileSync(`${__dirname}/constants.js`, updatedFile);
}
