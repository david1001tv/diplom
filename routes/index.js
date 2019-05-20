const router = require('express').Router();

const authRouter = require(base_dir + '/app/http/controllers/auth');

router.use('/auth', authRouter);

module.exports = router;
