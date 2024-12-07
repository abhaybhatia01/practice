const axios = require('axios');
const http = require('http');
const https = require('https');
let count = 0;
// Create an HTTP agent with connection pooling
const httpAgent = new http.Agent({ 
    keepAlive: true,
    maxSockets: 1000, // Maximum number of sockets to allow per host
    maxFreeSockets: 100, // Maximum number of sockets to leave open in a free state
    timeout: 10000 // Timeout for inactive sockets
});
const httpsAgent = new https.Agent({ 
    keepAlive: true,
    maxSockets: 1000, // Maximum number of sockets to allow per host
    maxFreeSockets: 100, // Maximum number of sockets to leave open in a free state
    timeout: 10000 // Timeout for inactive sockets
});

// Configure axios to use the HTTP agent
const axiosInstance = axios.create({
    httpAgent,
    httpsAgent
});

module.exports = {
    httpAgent,
    httpsAgent,
    axiosInstance
};
