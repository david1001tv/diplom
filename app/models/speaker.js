const mongoose = require('mongoose');
const Schema = mongoose.Schema;

module.exports = mongoose.model('speakers', new Schema({
  first_name: {
    type: String,
    required: true,
  },
  last_name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
  },
  github: {
    type: String,
    required: true,
  },
  interests: {
    type: String,
    default: ''
  },
  country: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'countries'
  }
}, {
  timestamps: true
}));
