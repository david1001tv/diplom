const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
const Schema = mongoose.Schema;

const ConferenceSchema = new Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  description: {
    type: String,
    default: '',
    required: true
  },
  address: {
    type: String,
    default: '',
    required: true
  },
  city: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'cities',
    required: true
  },
  date: {
    type: Date,
    default: Date.now,
    required: true
  }
}, {
  timestamps: true
}).plugin(uniqueValidator, {message: 'Field `{PATH}` must be unique'});

module.exports = mongoose.model('conferences', ConferenceSchema);
