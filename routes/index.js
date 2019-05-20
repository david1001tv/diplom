const router = require('express').Router();

const authRouter = require(base_dir + '/app/http/controllers/auth');
const accountRouter = require(base_dir + '/app/http/controllers/account');
const conferencesRouter = require(base_dir + '/app/http/controllers/conference');
const talksRouter = require(base_dir + '/app/http/controllers/talk');

const authMiddleware = require(base_dir + '/app/http/middleware/authMiddleware');

router.use('/auth', authRouter);
router.use('/account', authMiddleware, accountRouter);
router.use('/admin', authMiddleware, conferencesRouter);
router.use('/admin', authMiddleware, talksRouter);

module.exports = router;
