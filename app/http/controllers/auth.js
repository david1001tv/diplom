const router = require('express').Router();
const jwt = require('jsonwebtoken');
const config = require(base_dir + '/config').app;

const User = require(base_dir + '/app/models/user');
const UserAttributes = require(base_dir + '/app/models/userAttributes');

router.post('/register', async function (req, res) {
    let { login, email, password, firstName, lastName, city, country, phone} = req.body;

    if (!firstName || !lastName) {
        return res.status(422).json({
            success: false,
            message: 'First and Last names are required'
        });
    }

    const attributes = await UserAttributes.create({
       first_name: firstName,
       last_name: lastName,
       city: city,
       country: country,
       phone: phone
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
    }, config.secret, { expiresIn: config.accessTokenLife });

    return res.json({
       success: true,
       user: user,
       token: token
    });
});

module.exports = router;
