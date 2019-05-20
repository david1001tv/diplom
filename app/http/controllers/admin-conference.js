const router = require('express').Router();

const Conference = require(base_dir + '/app/models/conference');
const Talk = require(base_dir + '/app/models/talk');
const City = require(base_dir + '/app/models/city');

router.post('/conferences', async function (req, res) {
    const {name, description, address, city, date} = req.body;

    let cityFromDB = await City.findOne({_id:city});
    if (!cityFromDB) {
        return res.status(400).json({
            success: false,
            message: 'Invalid city'
        });
    }

    let conference = {};
    try {
        conference = await Conference.create({
            name,
            description,
            address,
            city: cityFromDB,
            date
        });
    } catch (e) {
        const status = e.name === 'ValidationError' ? 422 : 400;
        return res.status(status).json({
            success: false,
            message: e.message
        });
    }

    return res.json({
        success: true,
        data: conference
    });
});

router.get('/conferences', async function (req, res) {
    const {limit = 10, page = 1, query, date, startDate, finishDate, direction = 'desc', sortField = 'name'} = req.body;

    const search = await querySearch(query, date, startDate, finishDate);
    const sort = {};
    sort[sortField] = (direction === 'desc') ? -1 : 1;
    let conferences = await Conference.find(search, null, {
        skip: (+page - 1) * +limit,
        limit: limit,
        sort: sort
    }).populate({
        path: 'city',
        model: 'cities'
    });
    let total = await Conference.find(search).count();

    for (let i in conferences) {
        conferences[i].talks = await Talk.find({
            conference_id: conferences[i]._id
        }).populate({
            path: 'speaker',
            model: 'users',
            populate: {
                path: 'attributes',
                model: 'user_attributes'
            }
        });
    }

    return res.json({
        data: conferences,
        total: total
    });
});

router.get('/conferences/:id', async function (req, res) {
    let conference = await Conference.findOne({_id: req.params.id});
    if (!conference) {
        return res.status(404).json({
            success: false,
            message: 'Conference not found'
        });
    }``

    return res.json(conference);
});

router.put('/conferences/:id', async function (req, res) {
    const {name, description, address, city, date} = req.body;

    let cityFromDB = await City.findOne({_id:city});
    if (!cityFromDB) {
        return res.status(400).json({
            success: false,
            message: 'Invalid city'
        });
    }

    let conference = await Conference.findOne({_id: req.params.id});
    if (!conference) {
        return res.status(404).json({
            success: false,
            message: 'Conference not found'
        });
    }

    try {
        conference = await Conference.update({
            name,
            description,
            address,
            city: cityFromDB,
            date
        });
    } catch (e) {
        const status = e.name === 'ValidationError' ? 422 : 400;
        return res.status(status).json({
            success: false,
            message: e.message
        });
    }

    return res.json({
        success: true,
        data: conference
    });
});

router.delete('/conferences/:id', async function (req, res) {
    let conference = {};

    try {
        conference = await Conference.deleteOne({_id: req.params.id});
    } catch (e) {
        return res.status(400).json({
            success: false,
            message: e.message
        });
    }

    return res.json({
        success: true,
        data: conference
    });
});

function querySearch(query, date, startDate, finishDate) {
    let search = {};
    let $and = [];
    let queryOr = [];

    if (query) {
        query = query.split(' ');
        for (let i = 0; i < query.length; i++) {
            queryOr = [
                {name: new RegExp(query[i], 'i')},
                {description: new RegExp(query[i], 'i')},
            ];
        }
    }

    if (startDate && finishDate) {
        $and.push({createdAt: {$gte: decodeURIComponent(startDate), $lt: decodeURIComponent(finishDate)}});
    } else {
        if (startDate) {
            $and.push({createdAt: {$gte: decodeURIComponent(startDate)}});
        }
        if (finishDate) {
            $and.push({createdAt: {$lt: decodeURIComponent(finishDate)}});
        }
    }

    if ($and.length) {
        search.$and = $and;
    }
    if (queryOr.length) {
        search.$and = search.$and ? [...search.$and, ...[{$or: queryOr}]] : [{$or: queryOr}];
    }

    return search;
}


module.exports = router;
