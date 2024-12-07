const { httpAgent } = require('./http');
const http = require('http');

const getDelayedResponse = async () => {
    await new Promise((resolve, reject) => {
        const options = {
            hostname: 'localhost',
            port: 3000,
            path: '/delayed',
            method: 'GET',
            agent: httpAgent 
        };
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

        // End the request
        req.end();

    });

    await new Promise((resolve, reject) => {
        const options = {
            hostname: 'localhost',
            port: 3000,
            path: '/delayed2',
            method: 'GET',
            agent: httpAgent 
        };
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

        // End the request
        req.end();
    });
    console.log('here')
    return {success:true}
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

sendMultipleRequests(100000);

    setTimeout(() => {
        console.log('Success');
    }, 10000000); // 30 seconds delay