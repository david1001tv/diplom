const router = require('express').Router();

const Country = require(base_dir + '/app/models/country');

router.get('/', async function (req, res) {
  const countries = await Country.find();

  return res.json({
    success: true,
    data: countries
  });
});

module.exports = router;
