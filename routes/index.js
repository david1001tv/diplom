const router = require('express').Router();

const authRouter = require(base_dir + '/app/http/controllers/auth');
const accountRouter = require(base_dir + '/app/http/controllers/account');

const authMiddleware = require(base_dir + '/app/http/middleware/authMiddleware');

router.use('/auth', authRouter);
router.use('/account', authMiddleware, accountRouter);

module.exports = router;
