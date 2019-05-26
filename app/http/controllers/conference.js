const router = require('express').Router();

const Conference = require(base_dir + '/app/models/conference');
const Talk = require(base_dir + '/app/models/talk');
const Speaker = require(base_dir + '/app/models/speaker');
const UsersOnConferences = require(base_dir + '/app/models/usersOnConferences');
const User = require(base_dir + '/app/models/user');
const UserAttributes = require(base_dir + '/app/models/userAttributes');

router.get('/', async function (req, res) {
  const {limit = 10, page = 1, query, startDate, finishDate, sort = {'date': 1}, filter} = req.query;

  const search = await querySearch(query, startDate, finishDate, filter);
  let conferences = await Conference.find(search, null, {
    skip: (+page - 1) * +limit,
    limit: +limit,
    sort: sort,
  }).populate('city');
  let total = await Conference.find(search).count();

  for (let i in conferences) {
    conferences[i].talks = await Talk.find({
      conference: conferences[i]._id
    }).populate({
      path: 'speaker',
      model: 'speakers',
      populate: {
        path: 'country',
        model: 'countries'
      }
    });
  }

  return res.json({
    data: conferences,
    total: total
  });
});

router.get('/:id', async function (req, res) {
  let conference = await Conference.findOne({_id: req.params.id}).populate('city');
  const {query} = req.query;
  let search = await querySearch(query);

  if (!conference) {
    return res.status(404).json({
      success: false,
      message: 'Conference not found'
    });
  }

  query ? search.$and.push({
    conference: conference._id
  }) : search.conference = conference._id;

  const talks = await Talk.find(search).populate({
    path: 'speaker',
    model: 'speakers',
    populate: {
      path: 'country',
      model: 'countries'
    }
  });

  const talksOnConfa = await Talk.find({conference: conference._id}).select('speaker');
  const talksIds = [];
  await talksOnConfa.forEach(talk => {
    talksIds.push(talk.speaker);
  });

  search = makeSearch(query, talksIds);

  const speakers = await Speaker.find(search).populate({
    path: 'country',
    model: 'countries'
  });

  const userOnConfa = await UsersOnConferences.find({conference: conference._id}).select('user');
  const usersIds = [];
  await userOnConfa.forEach(item => {
    usersIds.push(item.user);
  });

  search = await querySearch(query);
  const usersAttr = await UserAttributes.find(search).select('_id');
  const usersAttrIds = [];
  await usersAttr.forEach(item => {
    usersAttrIds.push(item._id);
  });

  search = makeSearch(query, usersIds);
  search.$and.splice(1,1);
  search.$and.push({
    attributes: {
      $in: usersAttrIds
    }
  });

  const users = await User.find(search).populate('attributes');

  return res.json({
    conference,
    talks,
    speakers,
    users
  });
});

function makeSearch(query, searchIds) {
  let search = {};
  let searchOr = [];
  if (query) {
    query = query.split(' ');
    for (let i = 0; i < query.length; i++) {
      searchOr = [...searchOr,
        {name: new RegExp(query[i], 'i')},
        {description: new RegExp(query[i], 'i')},
        {first_name: new RegExp(query[i], 'i')},
        {last_name: new RegExp(query[i], 'i')},
        {interests: new RegExp(query[i], 'i')},
      ];
    }
  }
  if (searchIds) {
    search.$and = [{
      _id: {
        $in: searchIds
      }
    }];
  }
  if (searchOr.length) {
    search.$and = search.$and ? [...search.$and, {$or: searchOr}] : search.$and = [{$od:searchOr}];
  }

  return search;
}

function querySearch(query, startDate, finishDate, filter) {
  let search = {};
  let $and = [];
  let queryOr = [];

  if (query) {
    query = query.split(' ');
    for (let i = 0; i < query.length; i++) {
      queryOr = [...queryOr,
        {name: new RegExp(query[i], 'i')},
        {description: new RegExp(query[i], 'i')},
        {info: new RegExp(query[i], 'i')},
        {first_name: new RegExp(query[i], 'i')},
        {last_name: new RegExp(query[i], 'i')},
        {interests: new RegExp(query[i], 'i')},
      ];
    }
  }

  if (startDate && finishDate) {
    $and.push({date: {$gte: decodeURIComponent(startDate), $lt: decodeURIComponent(finishDate)}});
  } else {
    if (startDate) {
      $and.push({date: {$gte: decodeURIComponent(startDate)}});
    }
    if (finishDate) {
      $and.push({date: {$lt: decodeURIComponent(finishDate)}});
    }
  }

  if ($and.length) {
    search.$and = $and;
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
