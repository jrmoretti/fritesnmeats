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
  ORDERS[userName] = orderInfo;
  const updatedFile = `module.exports = ${JSON.stringify(ORDERS, null, 2)};`;
  fs.writeFileSync(`${__dirname}/constants.js`, updatedFile);
  resp.status(200).send('Success. You can now make an order with `/fritesnmeats order`');
}


function makeOrder(userName, resp) {
  const order = ORDERS[userName];
  if (!order) {
    return resp.status(400).send('You must first register an order with /fritesnmeats addOrder [order]');
  }

  mailOpts.text = order;
  transporter.sendMail(mailOpts, function(err, info) {
    if (err) {
      console.log('Error: ', err);
      resp.status(400).send('Could not make order :(');
    } else {
      resp.status(200).send(`You just ordered ${order}`);
    }
  });
}

function makeMultipleOrders(peopleOrdering, resp) {
  const allOrders = peopleOrdering.map(order => ORDERS[order]).filter(order => order);
  const ordersFor = Object.keys(ORDERS).filter(person => peopleOrdering.some(peep => peep == person));
  mailOpts.text = allOrders.join(', ');
  transporter.sendMail(mailOpts, function(err, info) {
    if (err) {
      console.log('Error: ', err);
      resp.status(400).send('Could not make order :(');
    } else {
      console.log('email sent', info);
      resp.status(200).send(`order sent for ${ordersFor.join(', ')}`);
    }
  });
}
