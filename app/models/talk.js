const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
const Schema = mongoose.Schema;

// set up a mongoose model
const TalkSchema = new Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  description: {
    type: String,
    required: true,
    default: ''
  },
  speaker: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'speakers',
    required: true
  },
  conference: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'conferences',
    required: true
  },
  info: {
    type: String,
    default: ''
  }
}, {
  timestamps: true
}).plugin(uniqueValidator, {message: 'Field `{PATH}` must be unique'});

module.exports = mongoose.model('talk', TalkSchema);
