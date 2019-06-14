const router = require('express').Router();

const City = require(base_dir + '/app/models/city');

router.get('/', async function (req, res) {
  const cities = await City.find();

  return res.json({
    success: true,
    data: cities
  });
});

module.exports = router;
