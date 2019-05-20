require('dotenv').config();
global.base_dir = './../diplom';

const mongoose = require('mongoose');
const config = require('./../config');

mongoose.connect(config.database.dbUrl, { useMongoClient: true });

console.log('================== seeds start ==================');

const countries = require('./../seeds/countries');
const Country = require('./../app/models/country');
async function seed () {
    for (let i in countries) {
        await Country.create({
            country_key: countries[i].country_key,
            country_name: countries[i].country_name
        });
    }

    console.log('================== seeds complete ==================');
    process.exit(0)
}

seed();