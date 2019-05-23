const router = require('express').Router();

const Talk = require(base_dir + '/app/models/talk');

router.get('/', async function (req, res) {
  const {limit = 10, page = 1, query, sort = {'name': 1}, filter} = req.query;

  const search = await querySearch(query, filter);
  let talks = await Talk.find(search, null, {
    skip: (+page - 1) * +limit,
    limit: limit,
    sort: sort
  }).populate('conference').populate('speaker');
  let total = await Talk.find(search).count();

  return res.json({
    data: talks,
    total: total
  });
});

router.get('/:id', async function (req, res) {
  let talk = await Talk.findOne({_id: req.params.id});
  if (!talk) {
    return res.status(404).json({
      success: false,
      message: 'Talk not found'
    });
  }

  return res.json(talk);
});

async function querySearch(query, filter) {
  let search = {};
  let $and = [];
  let queryOr = [];

  if (query) {
    query = query.split(' ');
    for (let i = 0; i < query.length; i++) {
      queryOr = [
        {name: new RegExp(query[i], 'i')},
        {description: new RegExp(query[i], 'i')},
        {info: new RegExp(query[i], 'i')},
      ];
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
