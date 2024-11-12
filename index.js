// Example of a simple proxy in Express.js (Node.js)
const express = require('express');
const cors = require('cors');
const app = express();
app.use(cors());


const auth = process.env.AUTH
const branchId = process.env.BRANCH_ID
const publicKey = process.env.PUBLIC_KEY

app.get('/api/borrowers/:from/:count', async (req, res) => {
    const { from, count } = req.params;
    const url = `https://api-main.loandisk.com/${publicKey}/${branchId}/borrower/from/${from}/count/${count}`;

    try {
        const response = await fetch(url, {
            method: "GET",
            headers: {
                Authorization: `Basic ${auth}`,
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*",
            },
        });
        console.log(response)
        if (!response.ok) {
            return res.status(500).json({ error: "Failed to fetch borrowers" });
        }

        const data = await response.json();
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: "An error occurred" });
    }
});

app.listen(3500, () => {
    console.log("Proxy server running on port 3500");
});
