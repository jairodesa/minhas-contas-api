const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const { strategiesAuthentication } = require('./src/user');
const allowCors = require('./src/utils/cors')

app.use(bodyParser.json());
app.use(allowCors);
module.exports = app;
