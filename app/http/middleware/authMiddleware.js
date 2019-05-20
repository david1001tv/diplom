const jwt = require('jsonwebtoken');
const config = require(base_dir + '/config').app;

const AccessToken = require(base_dir + '/app/models/accessToken');

module.exports = async function (req, res, next) {
    const token = req.body.token || req.params.token || req.headers['authorization'] || req.query.token;
    if (!token) {
        return res.status(401).json({
            success: false, message: 'No token provided.'
        });
    }

    let tokenFromDB = await AccessToken.findOne({ token: token });
    if (!tokenFromDB) {
        return res.status(403).json({
            success: false,
            message: 'Invalid token'
        });
    }

    let decoded = {}
    try {
        decoded = jwt.verify(tokenFromDB.token, config.secret)
    } catch (err) {
        const status = (err.name === 'TokenExpiredError') ? 401 : 403;
        return res.status(status).json({
            success: false, message: err.message
        });
    }

    if (req.baseUrl !== '/admin') {
        req.body.userId = decoded.id;
    } else {
        if (!decoded.isAdmin) {
            return res.status(403).json({
                success: false,
                message: 'No access'
            });
        }
    }

    return next();
};
