const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// set up a mongoose model
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
