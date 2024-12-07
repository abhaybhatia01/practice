 
const axios = require('axios');
const http = require('http');
const https = require('https');
let count = 0;
// Create an HTTP agent with connection pooling
const httpAgent = new http.Agent({ 
    keepAlive: true,
    maxSockets: 5000, // Maximum number of sockets to allow per host
    maxFreeSockets: 100, // Maximum number of sockets to leave open in a free state
    timeout: 10000 // Timeout for inactive sockets
});
const httpsAgent = new https.Agent({ 
    keepAlive: true,
    maxSockets: 5000, // Maximum number of sockets to allow per host
    maxFreeSockets: 100, // Maximum number of sockets to leave open in a free state
    timeout: 10000 // Timeout for inactive sockets
});
// Configure axios to use the HTTP agent
const axiosInstance = axios.create({
    httpAgent,
    httpsAgent
});
const getDelayedResponse = async () => {
    const data = JSON.stringify({
        "userID": "656f27a5a75f3c1df5b6b5d0",
        "reqID": "645a6a6ffe3d5cb59f5ac543",
        "reportID": "FLEMM_R2",
        "counter": 2,
        "interval": 3,
        "devID": "INEM_DEMO",
        "sensorID": "VOLTS1",
        "reportPeriodicity": "daily",
        "clusters": [],
        "startTime": "2024-09-30T18:30:00.000Z",
        "endTime": "2024-10-27T13:23:35.676Z",
        "timezone": "Asia/Calcutta"
    });
    const options = {
        hostname: 'localhost',
        port: 4021,
        path: '/api/device/apiLayer',
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Cookie': 'connect.sid=s%3Ai7tA-D-4RTnjEuPD3TXpCMNHyV4Sd5-3.oldhmq0O%2B4SpO3RDmd%2BjtHL9fRolkj1YF2xRbLzx2fI',
            'Content-Length': Buffer.byteLength(data)
        }
    };
    return new Promise((resolve, reject) => {
        const req = http.request(options, (res) => {
            let data = '';
            // A chunk of data has been received.
            res.on('data', (chunk) => {
                data += chunk;
            });
            // The whole response has been received.
            res.on('end', () => {
                resolve(JSON.parse(data)); // Assuming the response is JSON
            });
        });
        // Handle error
        req.on('error', (error) => {
            reject(`Problem with request: ${error.message}`);
        });
        // Write data to request body
        req.write(data);
        // End the request
        req.end();
    });
};
// Usage of the async function
const fetchData = async () => {
    try {
        const response = await getDelayedResponse();
        console.log(response);
    } catch (error) {
        console.error(error);
    }
};
const sendMultipleRequests = async (numRequests) => {
    for (let i = 0; i < numRequests; i++) {
        fetchData();
    }
};
sendMultipleRequests(1);
setTimeout(() => {
    console.log('Success');
}, 10000000); // 10 seconds delay
 