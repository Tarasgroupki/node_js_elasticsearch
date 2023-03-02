const http = require('http');
const app = require('./app');
const { server: config } = require('./config');

const server = http.createServer(app);

server.listen(config);
