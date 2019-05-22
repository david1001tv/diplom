const router = require('express').Router();

const User = require(base_dir + '/app/models/user');
const UserAttributes = require(base_dir + '/app/models/userAttributes');

router.get('/', async function (req, res) {
  const {userId} = req.body;

  const user = await User.findOne({_id: userId}).populate(['attributes', 'country']);

  if (!user) {
    return res.status(404).json({
      success: false,
      message: 'User not found'
    });
  }

  return res.json({
    success: true,
    data: user
  });
});

router.put('/', async function (req, res) {
  const {userId, firstName, lastName, city, country, phone, interests} = req.body;

  let user = await User.findOne({_id: userId}).populate(['attributes']);

  if (!user) {
    return res.status(404).json({
      success: false,
      message: 'User not found'
    });
  }

  const newAttr = {
    first_name: firstName,
    last_name: lastName,
    city: city,
    country: country,
    phone: phone,
    interests: interests
  };

  for (let key in newAttr) {
    if (typeof newAttr[key] === 'undefined') {
      delete newAttr[key];
    }
  }

  await UserAttributes.update({_id: user.attributes.id}, newAttr);
  user = await User.findOne({_id: userId}).populate({
    path: 'attributes',
    model: 'user_attributes',
    populate: {
      path: 'city',
      model: 'cities'
    }
  });

  return res.json({
    success: true,
    data: user
  });
});

router.patch('/password-reset', async function (req, res) {
  const {userId, oldPwd, newPwd} = req.body;

  const user = await User.findOne({_id: userId});

  if (!user) {
    return res.status(404).json({
      success: false,
      message: 'User not found'
    });
  }

  let strongPassword = new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{8,})');
  if ((await strongPassword.test(newPwd)) === false) {
    return res.status(422).json({
      success: false,
      message: 'Weak password'
    });
  }


  if (await user.comparePassword(oldPwd)) {
    user.password = newPwd;
    user.save();
    return res.json({
      success: true,
      message: 'Password updated'
    });
  } else {
    return res.status(400).json({
      success: false,
      message: 'Incorrect password'
    });
  }
});

module.exports = router;
