const router = require('express').Router();

const authRouter = require(base_dir + '/app/http/controllers/auth');
const accountRouter = require(base_dir + '/app/http/controllers/account');
const adminConferencesRouter = require(base_dir + '/app/http/controllers/admin/conference');
const adminTalksRouter = require(base_dir + '/app/http/controllers/admin/talk');

const authMiddleware = require(base_dir + '/app/http/middleware/authMiddleware');

router.use('/auth', authRouter);
router.use('/account', authMiddleware, accountRouter);
router.use('/admin', authMiddleware, adminConferencesRouter);
router.use('/admin', authMiddleware, adminTalksRouter);

module.exports = router;
