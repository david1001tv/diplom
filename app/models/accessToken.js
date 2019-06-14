const mongoose = require('mongoose');
const Schema = mongoose.Schema;

module.exports = mongoose.model('access_token', new Schema({
  token: {
    type: String,
    required: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user'
  },
  expires_at: {
    type: Date,
    required: true
  }
}, {
  timestamps: true
}));
