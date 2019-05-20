require('dotenv').config();
global.base_dir = './../diplom';

const mongoose = require('mongoose');
const config = require('./../config');

mongoose.connect(config.database.dbUrl, { useMongoClient: true });

console.log('================== seeds start ==================');

const cities = require('./../seeds/cities');
const City = require('./../app/models/city');
async function seed () {
    for (let i in cities) {
        for(let j in cities[i].cities) {
            console.log(cities[i].cities[j].name)
            await City.create({
                name:  cities[i].cities[j].name,
                description: cities[i].name
            });
        }
    }

    console.log('================== seeds complete ==================');
    process.exit(0)
}

seed();