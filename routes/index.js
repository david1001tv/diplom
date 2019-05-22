const router = require('express').Router();
const cors = require('cors');

const authRouter = require(base_dir + '/app/http/controllers/auth');
const accountRouter = require(base_dir + '/app/http/controllers/account');
const adminConferencesRouter = require(base_dir + '/app/http/controllers/admin/conference');
const adminTalksRouter = require(base_dir + '/app/http/controllers/admin/talk');
const adminSpeakerRouter = require(base_dir + '/app/http/controllers/admin/speaker');
const adminUserRouter = require(base_dir + '/app/http/controllers/admin/user');
const cityRouter = require(base_dir + '/app/http/controllers/city');
const countryRouter = require(base_dir + '/app/http/controllers/country');

const authMiddleware = require(base_dir + '/app/http/middleware/authMiddleware');

router.use(cors());
router.use('/auth', authRouter);
router.use('/cities', cityRouter);
router.use('/countries', countryRouter);
router.use('/account', authMiddleware, accountRouter);
router.use('/admin', authMiddleware, adminConferencesRouter);
router.use('/admin', authMiddleware, adminTalksRouter);
router.use('/admin', authMiddleware, adminSpeakerRouter);
router.use('/admin', authMiddleware, adminUserRouter);

module.exports = router;
