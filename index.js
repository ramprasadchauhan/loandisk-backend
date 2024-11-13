// Example of a simple proxy in Express.js (Node.js)
const express = require('express');
const cors = require('cors');
const app = express();
app.use(cors());

app.use(express.json());


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



app.all('/:resource/*', async (req, res) => {
    const { resource } = req.params;
    const urlParts = req.originalUrl.split('/').slice(2); // Remove the resource and leading slash
    const urlPath = urlParts.join('/'); // Join the remaining parts

    const targetUrl = `https://api-main.loandisk.com/${publicKey}/${branchId}/${resource}/${urlPath}`;

    console.log("Forwarding request to:", targetUrl);  // Add logging here

    try {
        const response = await fetch(targetUrl, {
            method: req.method,
            headers: {
                Authorization: `Basic ${auth}`,
                "Content-Type": "application/json",
            },
            body: req.method === 'POST' || req.method === 'PUT' ? JSON.stringify(req.body) : null,  // For POST/PUT requests
        });

        if (!response.ok) {
            return res.status(response.status).json({ error: "Failed to fetch data from API" });
        }

        const data = await response.json();
        res.json(data);
    } catch (error) {
        console.error("Error forwarding request:", error);
        res.status(500).json({ error: "An error occurred while processing the request" });
    }
});





app.listen(3500, () => {
    console.log("Proxy server running on port 3500");
});

