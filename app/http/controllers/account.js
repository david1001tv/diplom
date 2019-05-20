const router = require('express').Router();
const jwt = require('jsonwebtoken');
const config = require(base_dir + '/config').app;

const User = require(base_dir + '/app/models/user');
const UserAttributes = require(base_dir + '/app/models/userAttributes');

router.get('/', async function (req, res) {
    const {userId} = req.body;

    const user = await User.find({_id: userId}).populate(['attributes', 'country']);

    if (!user) {
        return res.status(404).json({
            success: false,
            message: 'User not found'
        });
    }

    return res.json({
        success: true,
        user
    });
});

router.put('/', async function (req, res) {
    const {userId, firstName, lastName, city, country, phone, interests, password} = req.body;

    let user = await User.findOne({_id: userId}).populate(['attributes']);

    if (!user) {
        return res.status(404).json({
            success: false,
            message: 'User not found'
        });
    }

    const newAttr = {
        first_name: firstName,
        last_name: lastName,
        city: city,
        country: country,
        phone: phone,
        interests: interests
    };

    for (let key in newAttr) {
        if (typeof newAttr[key] === 'undefined') {
            delete newAttr[key];
        }
    }

    await user.update({
        country
    });

    user.password = password;
    user.save();

    await UserAttributes.update({_id: user.attributes.id}, newAttr);
    user = await User.findOne({_id: userId}).populate(['attributes']);

    return res.json({
        success: true,
        user
    });
});

module.exports = router;
