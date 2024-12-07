const express = require('express');
const app = express();
const PORT = 3000;
let count =0 ;
// Define the /delayed endpoint
app.get('/delayed', (req, res) => {
    // Simulate a delay of 2 seconds (2000 milliseconds)
    console.log('sent',count++)
    setTimeout(() => {
        res.json({ message: 'This response was delayed!' });
    }, 2000);
});
app.get('/delayed2', (req, res) => {
    // Simulate a delay of 2 seconds (2000 milliseconds)
    console.log('sent',count++)
    setTimeout(() => {
        res.json({ message: 'This response was delayed!' });
    }, 2000);
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});