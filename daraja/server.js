require("dotenv").config();
const express = require("express");
const axios = require("axios");
const bodyParser = require("body-parser");

const app = express();
app.use(bodyParser.json());

const consumerKey = process.env.CONSUMER_KEY;
const consumerSecret = process.env.CONSUMER_SECRET;
const auth = Buffer.from(`${consumerKey}:${consumerSecret}`).toString('base64');

async function getAccessToken() {
  try {
    const response = await axios.get("https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials", {
      headers: {
        "Authorization": `Basic ${auth}`
      }
    });
    return response.data.access_token;
  } catch (error) {
    console.error('Error fetching access token', error.response ? error.response.data : error.message);
    throw new Error('Could not get access token');
  }
}

app.post("/startTransaction", async (req, res) => {
  const { amount, phone } = req.body;

  const requestBody = {
    BusinessShortCode: "174379",
    Password: "MTc0Mzc5YmZiMjc5ZjlhYTliZGJjZjE1OGU5N2RkNzFhNDY3Y2QyZTBjODkzMDU5YjEwZjc4ZTZiNzJhZGExZWQyYzkxOTIwMjQwODA3MTg1MDA0",
    Timestamp: "20240807161324",
    TransactionType: "CustomerPayBillOnline",
    Amount: amount,
    PartyA: phone,
    PartyB: "174379",
    PhoneNumber: "254701642699",
    CallBackURL: "https://mydomain.com/path",
    AccountReference: "CompanyXLTD",
    TransactionDesc: "Payment of Brian"
    
  };

  try {
    const accessToken = await getAccessToken();
    const response = await axios.post("https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials", requestBody, {
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${accessToken}`
      }
    });
    console.log(response.data);
    res.send(response.data);
  } catch (error) {
    console.error(error.response ? error.response.data : error.message);
    res.status(500).send("Error processing request");
  }
});

const port = process.env.PORT || 3002;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

