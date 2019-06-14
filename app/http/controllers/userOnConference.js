const router = require('express').Router();

const UsersOnConferences = require(base_dir + '/app/models/usersOnConferences');

router.post('/', async function (req, res) {
  const {userId, conference} = req.body;

  let userOnConfa = await UsersOnConferences.findOne({
    user: userId,
    conference
  });

  if (userOnConfa) {
    await UsersOnConferences.deleteOne({
      user: userId,
      conference
    });
  } else {
    userOnConfa = await UsersOnConferences.create({
      user: userId,
      conference
    });
  }

  return res.json({
    data: userOnConfa,
    success: true
  });
});

router.get('/', async function (req, res) {
  const {filter} = req.query;

  const search = await querySearch(filter);

  let conferences = await UsersOnConferences.find(search).populate('user').populate({
    path: 'conference',
    model: 'conferences',
    populate: {
      path: 'city',
      model: 'cities'
    }
  });
  let total = await UsersOnConferences.find(search).count();

  return res.json({
    data: conferences,
    total: total
  });
});

function querySearch(filter) {
  let search = {};
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
