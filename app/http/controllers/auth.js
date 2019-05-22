const router = require('express').Router();
const jwt = require('jsonwebtoken');
const config = require(base_dir + '/config').app;

const User = require(base_dir + '/app/models/user');
const UserAttributes = require(base_dir + '/app/models/userAttributes');
const AccessToken = require(base_dir + '/app/models/accessToken');

router.post('/register', async function (req, res) {
    const {login, email, password, firstName, lastName, city, country, phone, interests} = req.body;

    if (!firstName || !lastName) {
        return res.status(422).json({
            success: false,
            message: 'First and Last names are required'
        });
    }

    let strongPassword = new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{8,})');
    if ((await strongPassword.test(password)) === false) {
        return res.status(422).json({
            success: false,
            message: 'Weak password'
        });
    }

    const attributes = await UserAttributes.create({
        first_name: firstName,
        last_name: lastName,
        city: city,
        country: country,
        phone: phone,
        interests: interests
    });

    let user = {};
    try {
        user = await User.create({
            login,
            email,
            password,
            attributes
        });
    } catch (e) {
        const status = e.name === 'ValidationError' ? 422 : 400;
        return res.status(status).json({
            success: false,
            message: e.message
        });
    }

    const token = jwt.sign({
        id: user._id,
        isAdmin: user.is_admin
    }, config.secret, {expiresIn: config.accessTokenLife});

    await AccessToken.deleteMany({ expires_at: { $lt: new Date(Date.now()) } });

    await AccessToken.create({
        user: user._id,
        token: token,
        expires_at: new Date(Date.now() + config.accessTokenLife * 1000 + 30 * 3600 * 24 * 1000)
    });

    user = await User.findOne({_id: user._id}).populate({
        path: 'attributes',
        model: 'user_attributes',
        populate: {
            path: 'city',
            model: 'cities'
        }
    });

    return res.json({
        success: true,
        user: user,
        token: token
    });
});

router.post('/login', async function (req, res) {
    const {login, password} = req.body;

    let user = await User.findOne({
        $or: [{login: login}, {email: login}]
    }).select('+password');
    if (!user) {
        return res.status(400).json({
            success: false,
            message: 'Invalid login and/or password'
        });
    }

    if (await user.comparePassword(password)) {
        const token = jwt.sign({
            id: user._id,
            isAdmin: user.is_admin
        }, config.secret, { expiresIn: config.accessTokenLife });

        await AccessToken.deleteMany({ expires_at: { $lt: new Date(Date.now()) } });

        await AccessToken.create({
            user: user._id,
            token: token,
            expires_at: new Date(Date.now() + config.accessTokenLife * 1000 + 30 * 3600 * 24 * 1000)
        });

        return res.json({
            success: true,
            token: token
        });
    } else {
        return res.status(400).json({
            success: false,
            message: 'Invalid login and/or password'
        });
    }
});

router.post('/refresh', async function (req, res) {
    const {token: oldToken} = req.body.token || req.headers['authorization'];

    let tokenFromDB = await AccessToken.findOne({ token: oldToken });
    if (!tokenFromDB) {
        return res.status(403).json({
            success: false,
            message: 'Invalid token'
        });
    }

    let decoded = {};
    try {
        decoded = jwt.verify(tokenFromDB, config.secret,{ ignoreExpiration: true, maxAge: '30d' });
    } catch (e) {
        return res.status(401).json({
            success: false,
            message: e.message
        });
    }

    const user = await User.findById(decoded.id);

    const token = jwt.sign({
        id: user._id,
        isAdmin: user.is_admin
    }, config.secret, { expiresIn: config.accessTokenLife });

    return res.json({
        success: true,
        token: token
    });
});

router.post('/logout', async function (req, res) {
    try {
        const token = req.body.token || req.headers['authorization']

        await AccessToken.deleteOne({ token: token })
        res.status(200).json({ success: true })
    } catch (err) {
        res.status(400).json({ success: false, message: err.message })
    }
});

module.exports = router;
