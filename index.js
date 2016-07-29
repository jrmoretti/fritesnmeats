const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const mailer = require('nodemailer');
const TOKEN = '$2a$10$PaERCPVrl6/iKl1SceAOMuWgOvnJYXIXl.0iCy1W95E7jNQylxXEK';
const ORDERS = require('./orders');
const moment = require('moment-timezone');

const app = express();
const port = process.env.PORT || '3030';

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

const urlencodedParser = bodyParser.urlencoded({ extended: false });

app.post('/', urlencodedParser, function(req, resp) {
  const { body, token, text } = req.body;

  if (!bcrypt.compareSync(token, TOKEN)) {
    return resp.status(400).send("UNAUTHORIZED_TOKEN");
  }

  if (moment.tz('America/New_York').format('dddd') !== 'Thursday') {
    return resp.status(400).send("You can only order on Thursdays :(");
  }

  try {
    const peopleOrdering = text.slice(6).split(',').map(person => person.trim());
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
  } catch (e) {
    return resp.status(400).send(`You will never know what went wrong; jk here it is: ${e}`);
  }
});

app.listen(port);
console.log(`server started on ${port}`);
