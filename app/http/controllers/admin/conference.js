const router = require('express').Router();

const Conference = require(base_dir + '/app/models/conference');
const Talk = require(base_dir + '/app/models/talk');
const City = require(base_dir + '/app/models/city');

router.post('/conferences', async function (req, res) {
  const {name, description, address, city, date} = req.body;

  let conference = {};
  try {
    conference = await Conference.create({
      name,
      description,
      address,
      city,
      date
    });
  } catch (e) {
    const status = e.name === 'ValidationError' ? 422 : 400;
    return res.status(status).json({
      success: false,
      message: e.message
    });
  }

  conference = await Conference.findOne({_id: conference._id}).populate('city');

  return res.json({
    success: true,
    data: conference
  });
});

router.get('/conferences', async function (req, res) {
  const {limit = 10, page = 1, query, startDate, finishDate, sort = {'date': 1}, filter} = req.query;

  const search = await querySearch(query, startDate, finishDate, filter);
  let conferences = await Conference.find(search, null, {
    skip: (+page - 1) * +limit,
    limit: limit,
    sort: sort,
  }).populate('city');
  let total = await Conference.find(search).count();

  for (let i in conferences) {
    conferences[i].talks.push(await Talk.find({
      conference: conferences[i]._id
    }).populate({
      path: 'speaker',
      model: 'speakers'
    }));
  }

  return res.json({
    data: conferences,
    total: total
  });
});

router.get('/conferences/:id', async function (req, res) {
  let conference = await Conference.findOne({_id: req.params.id}).populate('city');
  if (!conference) {
    return res.status(404).json({
      success: false,
      message: 'Conference not found'
    });
  }
  conference.talks = await Talk.find({
    conference_id: conference._id
  }).populate({
    path: 'speaker',
    model: 'speaker'
  });

  return res.json(conference);
});

router.put('/conferences/:id', async function (req, res) {
  const {name, description, address, city, date} = req.body;

  let conference = await Conference.findOne({_id: req.params.id});
  if (!conference) {
    return res.status(404).json({
      success: false,
      message: 'Conference not found'
    });
  }

  try {
    await conference.update({
      name,
      description,
      address,
      city,
      date
    });
  } catch (e) {
    const status = e.name === 'ValidationError' ? 422 : 400;
    return res.status(status).json({
      success: false,
      message: e.message
    });
  }

  conference = await Conference.findOne({_id: conference._id}).populate('city');

  return res.json({
    success: true,
    data: conference
  });
});

router.delete('/conferences/:id', async function (req, res) {
  let conference = {};

  try {
    conference = await Conference.deleteOne({_id: req.params.id});
  } catch (e) {
    return res.status(400).json({
      success: false,
      message: e.message
    });
  }

  return res.json({
    success: true,
    data: conference
  });
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
