const mongoose = require('mongoose')
const Schema = mongoose.Schema
const uniqueValidator = require('mongoose-unique-validator')

// set up a mongoose model
module.exports = mongoose.model('countries', new Schema({
  country_key: {
    type: String,
    required: true,
    unique: true
  },
  country_name: {
    type: String,
    required: true,
    unique: true
  }
}, {
  timestamps: true
}).plugin(uniqueValidator, {message: 'Field `{PATH}` must be unique'}))
