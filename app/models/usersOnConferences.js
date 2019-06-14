const mongoose = require('mongoose');
const Schema = mongoose.Schema;

module.exports = mongoose.model('users_on_conferences', new Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'users',
    required: true
  },
  conference: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'conferences',
    required: true
  },
}, {
  timestamps: true
}));
