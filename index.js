require('dotenv').config();
global.base_dir = __dirname;

const app = require('express')();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const config = require(base_dir + '/config');
const router = require(base_dir + '/routes');

mongoose.connect(config.database.dbUrl, { useMongoClient: true });

app.use(bodyParser.urlencoded());
app.use(bodyParser.json());

app.use('/', router);

app.listen(config.app.port);
console.log('================== server started ==================');
