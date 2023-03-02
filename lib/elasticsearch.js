const { Client } = require('@elastic/elasticsearch');
const path = require('../config');

console.log(path.elastic)
module.exports = new Client({
    node: path.elastic.node,
    auth: {
        username: path.elastic.username,
        password: path.elastic.password
      },
});
