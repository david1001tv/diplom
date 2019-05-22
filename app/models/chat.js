const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// set up a mongoose model
module.exports = mongoose.model('chats', new Schema({
  from_user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'users',
    required: true
  },
  to_user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'users',
    required: true
  }
}, {
  timestamps: true
}));
