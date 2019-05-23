const router = require('express').Router();
const randtoken = require('rand-token');

const User = require(base_dir + '/app/models/user');
const UserAttributes = require(base_dir + '/app/models/userAttributes');
const City = require(base_dir + '/app/models/city');

router.post('/users', async function (req, res) {
  const {email, is_admin, firstName, lastName, city, country, phone, interests} = req.body;

  if (!firstName || !lastName) {
    return res.status(422).json({
      success: false,
      message: 'First and Last names are required'
    });
  }

  const attributes = await UserAttributes.create({
    first_name: firstName,
    last_name: lastName,
    city: city,
    country: country,
    phone: phone,
    interests: interests
  });

  let user = {};
  const password = randtoken.uid(10);
  try {
    user = await User.create({
      login: email,
      email: email,
      password: password,
      attributes,
      is_admin: is_admin
    });
  } catch (e) {
    const status = e.name === 'ValidationError' ? 422 : 400;
    return res.status(status).json({
      success: false,
      message: e.message
    });
  }

  user = await User.findOne({_id: user._id}).populate({
    path: 'attributes',
    model: 'user_attributes'
  });

  //todo send mail with login & password

  return res.json({
    success: true,
    data: user
  });
});

router.get('/users', async function (req, res) {
  const {limit = 10, page = 1, query, sort = {'name': 1}, filter} = req.query;

  const search = await querySearch(query, filter);
  let users = await User.find(search, null, {
    skip: (+page - 1) * +limit,
    limit: +limit,
    sort: sort
  }).populate({
    path: 'attributes',
    model: 'user_attributes'
  });
  let total = await User.find(search).count();

  return res.json({
    data: users,
    total: total
  });
});

router.get('/users/:id', async function (req, res) {
  let user = await User.findOne({_id: req.params.id}).populate({
    path: 'attributes',
    model: 'user_attributes'
  });
  if (!user) {
    return res.status(404).json({
      success: false,
      message: 'User not found'
    });
  }

  return res.json(user);
});

router.put('/users/:id', async function (req, res) {
  const {firstName, lastName, city, country, phone, interests} = req.body;

  let user = await User.findOne({_id: req.params.id}).populate(['attributes']);
  if (!user) {
    return res.status(404).json({
      success: false,
      message: 'User not found'
    });
  }

  let cityFromDB = await City.findOne({id: city});

  const newAttr = {
    first_name: firstName,
    last_name: lastName,
    city: cityFromDB,
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
  user = await User.findOne({_id: req.params.id}).populate({
    path: 'attributes',
    model: 'user_attributes'
  });

  return res.json({
    success: true,
    data: user
  });
});

router.delete('/users/:id', async function (req, res) {
  let user = {};

  try {
    user = await User.deleteOne({_id: req.params.id});
  } catch (e) {
    return res.status(400).json({
      success: false,
      message: e.message
    });
  }

  return res.json({
    success: true,
    data: user
  });
});

async function querySearch(query, filter) {
  let search = {};
  let queryOr = [];

  if (query) {
    query = query.split(' ');
    for (let i = 0; i < query.length; i++) {
      queryOr = [
        {login: new RegExp(query[i], 'i')},
        {email: new RegExp(query[i], 'i')},
        {first_name: new RegExp(query[i], 'i')},
        {last_name: new RegExp(query[i], 'i')},
        {interests: new RegExp(query[i], 'i')}
      ];
    }
  }

  if (queryOr.length) {
    search.$and = search.$and ? [...search.$and, ...[{$or: queryOr}]] : [{$or: queryOr}];
  }
  if (filter) {
    let key = Object.keys(filter)[0];
    let values = filter[key];
    search[key] = {
      $in: values
    }
  }

  return search;
}


module.exports = router;
