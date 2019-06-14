const mongoose = require('mongoose');
const Schema = mongoose.Schema;

module.exports = mongoose.model('cities', new Schema({
  name: {
    type: String,
    required: true
  },
  description: {
    type: String,
    default: ''
  }
}, {
  timestamps: true
}));
