const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// set up a mongoose model
module.exports = mongoose.model('user_attributes', new Schema({
  first_name: {
    type: String,
    default: '',
    required: true
  },
  last_name: {
    type: String,
    default: '',
    required: true
  },
  city: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'countries'
  },
  country: {
    type: String,
    default: ''
  },
  phone: {
    type: String,
    default: ''
  }
}, {
  timestamps: true
}));
