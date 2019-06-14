const mongoose = require('mongoose');
const Schema = mongoose.Schema;

module.exports = mongoose.model('messages', new Schema({
  chat_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'chats',
    required: true
  },
  text: {
    type: String.Schema.Types.ObjectId,
    required: true
  },
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'users',
    required: true
  }
}, {
  timestamps: true
}));
