const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
const Schema = mongoose.Schema;

// set up a mongoose model
module.exports = mongoose.model('cities', new Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    description: {
        type: String,
        default: ''
    }
}, {
    timestamps: true
})).plugin(uniqueValidator, { message: 'Field `{PATH}` must be unique' });
