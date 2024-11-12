// Example of a simple proxy in Express.js (Node.js)
const express = require('express');
const cors = require('cors');
const app = express();
app.use(cors());


const auth = process.env.AUTH
const branchId = process.env.BRANCH_ID
const publicKey = process.env.PUBLIC_KEY

// app.get('/api/borrowers/:from/:count', async (req, res) => {
//     const { from, count } = req.params;
//     const url = `https://api-main.loandisk.com/${publicKey}/${branchId}/borrower/from/${from}/count/${count}`;

//     try {
//         const response = await fetch(url, {
//             method: "GET",
//             headers: {
//                 Authorization: `Basic ${auth}`,
//                 "Content-Type": "application/json",
//                 "Access-Control-Allow-Origin": "*",
//             },
//         });
//         console.log(response)
//         if (!response.ok) {
//             return res.status(500).json({ error: "Failed to fetch borrowers" });
//         }

//         const data = await response.json();
//         res.json(data);
//     } catch (error) {
//         res.status(500).json({ error: "An error occurred" });
//     }
// });

app.use(express.json());

// General Proxy Route for Any API Endpoint
app.all('/api/*', async (req, res) => {
    // Build the target URL dynamically by replacing the '/api' part
    const targetUrl = `https://api-main.loandisk.com${req.originalUrl.replace('/api', '')}`;

    try {
        // Forward the request to the third-party API
        const response = await fetch(targetUrl, {
            method: req.method,  // Preserve the HTTP method (GET, POST, etc.)
            headers: {
                Authorization: `Basic ${auth}`,
                "Content-Type": "application/json",
                // Forward any other headers as necessary
            },
            body: req.method === 'POST' || req.method === 'PUT' ? JSON.stringify(req.body) : null, // Forward body if necessary
        });

        // If response is not OK, return error
        if (!response.ok) {
            return res.status(response.status).json({ error: "Failed to fetch data from API" });
        }

        // Parse and send the response from the third-party API
        const data = await response.json();
        res.json(data);
    } catch (error) {
        // Handle errors
        console.error("Error forwarding request:", error);
        res.status(500).json({ error: "An error occurred while processing the request" });
    }
});

app.listen(3500, () => {
    console.log("Proxy server running on port 3500");
});

