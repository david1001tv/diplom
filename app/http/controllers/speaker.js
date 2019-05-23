const router = require('express').Router();

const Speaker = require(base_dir + '/app/models/speaker');

router.get('/', async function (req, res) {
  const {limit = 10, page = 1, query, sort = {'first_name': 1}, filter} = req.query;

  const search = await querySearch(query, filter);
  let speakers = await Speaker.find(search, null, {
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

router.get('/:id', async function (req, res) {
  let speaker = await Speaker.findOne({_id: req.params.id}).populate('country');
  if (!speaker) {
    return res.status(404).json({
      success: false,
      message: 'Speaker not found'
    });
  }

  return res.json(speaker);
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
