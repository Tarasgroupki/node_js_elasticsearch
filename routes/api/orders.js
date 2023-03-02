const express = require('express');

const router = express.Router();
const loader = require('../middleware/file-upload');
const readCsv = require('../../lib/readCSV');
const client = require('../../lib/elasticsearch');

// - method for getting all orders with pagination and all filters
router.get('/', async (req, res) => {
    try {
        // const { page, perPage, sortBy, asc } = req.query;
        const { field, search } = req.query;
        const result = await client.search({
            index: 'orders',
            query: {
                match: { [field]: search }
            }
        });

        return res.status(200).json(result.hits.hits);
    } catch (err) {
        throw err;
    }
});

// - method for uploading data from csv file to orders database
router.post('/', loader.file('csv_file_url', 'uploads', /image\.*/i, false), async (req, res) => {
    try {
        const result = [];
        const csv = await readCsv(req.fileUrl);
        csv.forEach((c) => {
            result.push(
                {
                    customer_id: c[0],
                    product_name: c[1],
                    name: c[2],
                    email: c[3],
                    address: c[4],
                    product_price: c[5],
                    order_date: c[6],
                    quantity: c[7]
                });
        });

        // Let's start by indexing some data
        const body = result.flatMap(doc => [{ index: { _index: "orders" } }, doc]);

        const { body: bulkResponse } = await client.bulk({ refresh: true, body });

        if (bulkResponse?.errors) {
            const erroredDocuments = [];
            // The items array has the same order of the dataset we just indexed.
            // The presence of the `error` key indicates that the operation
            // that we did for the document has failed.
            bulkResponse.items.forEach((action, i) => {
                const operation = Object.keys(action)[0];
                if (action[operation].error) {
                    erroredDocuments.push({
                        // If the status is 429 it means that you can retry the document,
                        // otherwise it's very likely a mapping error, and you should
                        // fix the document before to try it again.
                        status: action[operation].status,
                        error: action[operation].error,
                        operation: body[i * 2],
                        document: body[i * 2 + 1],
                    });
                }
            });
        }

        return res.status(200).json({
            message: 'ok',
        });
    } catch (err) {
        throw err;
    }
});

module.exports = router;
