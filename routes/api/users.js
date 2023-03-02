const express = require('express');

const router = express.Router();
const client = require('../../lib/elasticsearch');

router.post('/', async (req, res) => {
    try {
        const { name, surname, age, sex } = req.body;
        // Let's start by indexing some data
        await client.index({
            index: 'users',
            document: {
                name,
                surname,
                age,
                sex
            }
        });

        // here we are forcing an index refresh, otherwise we will not
        // get any result in the consequent search
        await client.indices.refresh({ index: 'users' });

        return res.status(200).json({
            status: 'User successfully created!'
        });
    } catch (err) {
        throw err;
    }
});

router.get('/', async (req, res) => {
    try {
        const { field, search } = req.query;
        const result = await client.search({
            index: 'users',
            query: {
                match: { [field]: search }
            }
        });

        return res.status(200).json(result.hits.hits);
    } catch (err) {
        throw err;
    }
});

module.exports = router;
