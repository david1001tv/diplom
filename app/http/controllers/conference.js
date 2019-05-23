const router = require('express').Router();

const Conference = require(base_dir + '/app/models/conference');
const Talk = require(base_dir + '/app/models/talk');

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
  if (!conference) {
    return res.status(404).json({
      success: false,
      message: 'Conference not found'
    });
  }
  conference.talks = await Talk.find({
    conference: conference._id
  }).populate({
    path: 'speaker',
    model: 'speakers',
    populate: {
      path: 'country',
      model: 'countries'
    }
  });

  return res.json(conference);
});

function querySearch(query, startDate, finishDate, filter) {
  let search = {};
  let $and = [];
  let queryOr = [];

  if (query) {
    query = query.split(' ');
    for (let i = 0; i < query.length; i++) {
      queryOr = [
        {name: new RegExp(query[i], 'i')},
        {description: new RegExp(query[i], 'i')},
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
