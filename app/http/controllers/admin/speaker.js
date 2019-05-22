const router = require('express').Router();
const randtoken = require('rand-token');

const Country = require(base_dir + '/app/models/country');
const Speaker = require(base_dir + '/app/models/speaker');
const User = require(base_dir + '/app/models/user');
const UserAttributes = require(base_dir + '/app/models/userAttributes');

router.post('/speakers', async function (req, res) {
  const {firstName, lastName, email, github, country, interests, account} = req.body;

  let countryFromDB = Country.findOne({_id: country});

  let speaker = await Speaker.create({
    first_name: firstName,
    last_name: lastName,
    email: email,
    github: github,
    interests: interests,
    country: countryFromDB
  });

  if (account) {
    const attributes = await UserAttributes.create({
      first_name: firstName,
      last_name: lastName,
      country: countryFromDB.country_name,
      interests: interests
    });
    const password = randtoken.uid(10);

    const user = await User.create({
      login: email,
      email: email,
      password: password,
      attributes
    });
    //todo send mail
  }

  speaker = await Speaker.findOne({_id: speaker._id}).populate('country');

  return res.json({
    success: true,
    data: speaker
  });
});

router.get('/speakers', async function (req, res) {
  const {limit = 10, page = 1, query, sort = {'first_name': 1}, filter} = req.query;

  const search = await querySearch(query, filter);
  let speakers = await Speaker.find(search, {
    skip: (+page - 1) * +limit,
    limit: limit,
    sort: sort
  }).populate('country');
  let total = await Speaker.find(search).count();

  return res.json({
    data: speakers,
    total: total
  });
});

router.get('/speakers/:id', async function (req, res) {
  let speaker = await Speaker.findOne({_id: req.params.id}).populate('country');
  if (!speaker) {
    return res.status(404).json({
      success: false,
      message: 'Speaker not found'
    });
  }

  return res.json(speaker);
});

router.put('/speakers/:id', async function (req, res) {
  const {firstName, lastName, email, github, country, interests} = req.body;

  let speaker = await Speaker.findOne({_id: req.params.id});
  if (!speaker) {
    return res.status(404).json({
      success: false,
      message: 'Speaker not found'
    });
  }

  await speaker.update({
    first_name: firstName,
    last_name: lastName,
    email: email,
    github: github,
    interests: interests,
    country: country
  });
  speaker = await Speaker.findOne({_id: req.params.id}).populate('country');

  return res.json({
    success: true,
    data: speaker
  });
});

router.delete('/speakers/:id', async function (req, res) {
  let speaker = {};

  try {
    speaker = await Speaker.deleteOne({_id: req.params.id});
  } catch (e) {
    return res.status(400).json({
      success: false,
      message: e.message
    });
  }

  return res.json({
    success: true,
    data: speaker
  });
});

async function querySearch(query, filter) {
  let search = {};
  let queryOr = [];

  if (query) {
    query = query.split(' ');
    for (let i = 0; i < query.length; i++) {
      queryOr = [
        {first_name: new RegExp(query[i], 'i')},
        {last_name: new RegExp(query[i], 'i')},
        {interests: new RegExp(query[i], 'i')},
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
