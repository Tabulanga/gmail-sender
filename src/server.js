const express = require('express');
const mongoose = require('mongoose');
const config = require('./config/config.js');
const routes = require('./routes/index');
const redis = require('./controllers/queue');
const gmail = require('./controllers/sender');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(routes);

mongoose.connect(config.database.uri, config.database.options);
mongoose.connection
  .once('open', () => {
    console.log('MongoDB - successful connection ...');

    app.listen(process.env.PORT || config.port,
      () => {
        console.log('Server start on port', config.port, '...');
      });
  })
  .on('error', error => console.warn(error))
  .on('disconnected', () => console.log('Database disconnected', ' Time:', Date.now()))
  .on('reconnected', () => console.log('Database reconnected'));

redis.queueManagerStart();
gmail.init();
