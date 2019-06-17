require('dotenv').config();
global.base_dir = './../diplom';

const mongoose = require('mongoose');
const config = require('./../config');

mongoose.connect(config.database.dbUrl, {useMongoClient: true});

console.log('================== seeds start ==================');

const User = require('./../app/models/user');
const UserAttributes = require('./../app/models/userAttributes');

async function seed() {
  let adminAttributes = await UserAttributes.create({ first_name: 'admin', last_name: 'admin', phone: '88005553535' });

  await User.create({
    login: 'admin',
    password: 'admin',
    email: 'admin@admin.com',
    attributes: adminAttributes,
    is_admin: true
  });

  console.log('================== seeds complete ==================');
  process.exit(0)
}

seed();