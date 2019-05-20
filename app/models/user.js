const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt-nodejs');
const SALT_WORK_FACTOR = 11;

const UserSchema = new Schema({
  login: {
    type: String,
    required: true,
    unique: true
  },
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true,
    select: false
  },
  is_admin: {
    type: Boolean,
    required: true,
    default: false
  },
  attributes: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user_attributes'
  }
}, {
  timestamps: true
}).plugin(uniqueValidator, { message: 'Field `{PATH}` must be unique' });

UserSchema.pre('save', function (next) {
  let user = this;

  if (!user.isModified('password')) return next()

  bcrypt.genSalt(SALT_WORK_FACTOR, function (err, salt) {
    if (err) return next(err);
    bcrypt.hash(user.password, salt, null, function (err, hash) {
      if (err) {
        return next(err);
      }
      user.password = hash;
      next();
    })
  });
});

UserSchema.methods.comparePassword = async function (candidatePassword) {
  return new Promise((resolve, reject) => {
    bcrypt.compare(candidatePassword, this.password, function (err, data) {
      if (err !== null) {
        return reject(err);
      }
      resolve(data);
    })
  })
};

module.exports = mongoose.model('users', UserSchema);
