const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const moment = require('moment-timezone');

const validateOrder = require('./utils/validate-order');
const processOrder = require('./utils/process-order');
const TOKEN = '$2a$10$PaERCPVrl6/iKl1SceAOMuWgOvnJYXIXl.0iCy1W95E7jNQylxXEK';

const app = express();
const port = process.env.PORT || '3700';

const urlencodedParser = bodyParser.urlencoded({ extended: false });

app.post('/', urlencodedParser, function(req, resp) {
  const { token, text, user_name } = req.body;

  if (!bcrypt.compareSync(token, TOKEN)) {
    return resp.status(400).send("UNAUTHORIZED_TOKEN");
  }

  if (moment.tz('America/New_York').format('dddd') !== 'Thursday' && process.env.FORCE_ORDER !== 'true') {
    return resp.status(400).send("You can only order on Thursdays :(");
  }

  try {
    const order = text.split(' ')[0];
    validateOrder(order);

    const orderInfo = text.toLowerCase().split(' ').slice(1).join(' ');
    processOrder(user_name, order, orderInfo, resp);
  } catch (e) {
    return resp.status(400).send(`You will never know what went wrong; jk here it is: ${e}`);
  }
});

app.get('/', function(req, resp) {
  return resp.status(200).send('Welcome to fritesnmeats slack integration');
})

app.listen(port);
console.log(`server started on ${port}`);
