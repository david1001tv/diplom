const router = require('express').Router();

const Talk = require(base_dir + '/app/models/talk');

router.post('/talks', async function (req, res) {
    const {name, description, speaker, conference, info} = req.body;

    let talk = {};
    try {
        talk = await Talk.create({
            name,
            description,
            speaker,
            conference,
            info
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
        data: talk
    });
});

router.get('/talks', async function (req, res) {
    const {limit = 10, page = 1, query, speaker, direction = 'desc', sortField = 'name'} = req.body;

    const search = await querySearch(query, speaker);
    const sort = {};
    sort[sortField] = (direction === 'desc') ? -1 : 1;
    let talks = await Talk.find(search, {
        skip: (+page - 1) * +limit,
        limit: limit,
        sort: sort
    }).populate('conference').populate({
        path: 'speaker',
        model: 'users',
        populate: {
            path: 'attributes',
            model: 'user_attributes'
        }
    });
    let total = await Talk.find(search).count();

    return res.json({
        data: talks,
        total: total
    });
});

router.get('/talks/:id', async function (req, res) {
    let talk = await Talk.findOne({_id: req.params.id});
    if (!talk) {
        return res.status(404).json({
            success: false,
            message: 'Talk not found'
        });
    }

    return res.json(talk);
});

router.put('/talks/:id', async function (req, res) {
    const {name, description, speaker, conference, info} = req.body;

    let talk = await Talk.findOne({_id: req.params.id});
    if (!talk) {
        return res.status(404).json({
            success: false,
            message: 'Talk not found'
        });
    }

    try {
        talk = await Talk.update({
            name,
            description,
            speaker,
            conference,
            info
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
        data: talk
    });
});

router.delete('/talks/:id', async function (req, res) {
    let talk = {};

    try {
        talk = await Talk.deleteOne({_id: req.params.id});
    } catch (e) {
        return res.status(400).json({
            success: false,
            message: e.message
        });
    }

    return res.json({
        success: true,
        data: talk
    });
});

async function querySearch(query, speaker) {
    let search = {};
    let $and = [];
    let queryOr = [];

    if (query) {
        query = query.split(' ');
        for (let i = 0; i < query.length; i++) {
            queryOr = [
                {name: new RegExp(query[i], 'i')},
                {description: new RegExp(query[i], 'i')},
                {info: new RegExp(query[i], 'i')},
            ];
        }
    }

    if (speaker) {
        $and.push({speaker: speaker});
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
