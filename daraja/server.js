
// require("dotenv").config();
// const express = require("express");
// const axios = require("axios");
// const bodyParser = require("body-parser");

// const app = express();
// app.use(bodyParser.json());

// const consumerKey = process.env.CONSUMER_KEY;
// const consumerSecret = process.env.CONSUMER_SECRET;
// const auth = Buffer.from(`${consumerKey}:${consumerSecret}`).toString('base64');

// async function getAccessToken() {
//   try {
//     const response = await axios.get("https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials", {
//       headers: {
//         "Authorization": `Basic ${auth}`
//       }
//     });
//     return response.data.access_token;
//   } catch (error) {
//     console.error('Error fetching access token', error.response ? error.response.data : error.message);
//     throw new Error('Could not get access token');
//   }
// }

// app.post("/startTransaction", async (req, res) => {
//   const { amount, phone } = req.body;

//   const requestBody = {
//     BusinessShortCode: "174379",
//     Password: "MTc0Mzc5YmZiMjc5ZjlhYTliZGJjZjE1OGU5N2RkNzFhNDY3Y2QyZTBjODkzMDU5YjEwZjc4ZTZiNzJhZGExZWQyYzkxOTIwMjQwODA3MTg1MDA0",
//     Timestamp: "20240807161324",
//     TransactionType: "CustomerPayBillOnline",
//     Amount: amount,
//     PartyA: phone,
//     PartyB: "174379",
//     PhoneNumber: phone, // This should match the user's phone number
//     CallBackURL: "https://mydomain.com/path",
//     AccountReference: "CompanyXLTD",
//     TransactionDesc: "Payment of Brian"
//   };

//   try {
//     const accessToken = await getAccessToken();
//     const response = await axios.post("https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest", requestBody, {
//       headers: {
//         "Content-Type": "application/json",
//         "Authorization": `Bearer ${accessToken}`
//       }
//     });
//     console.log(response.data);
//     res.send(response.data);
//   } catch (error) {
//     console.error(error.response ? error.response.data : error.message);
//     res.status(500).send("Error processing request");
//   }
// });

// const port = process.env.PORT || 3003;
// app.listen(port, () => {
//   console.log(`Server is running on port ${port}`);
// });

require('dotenv').config();
const express = require('express');
const unirest = require('unirest');

const app = express();
app.use(express.json());

app.post('/startTransaction', (req, res) => {
  const { amount, phoneNumber } = req.body;

  // Prepare the request body for STK Push
  const requestBody = {
    "BusinessShortCode": 174379,
    "Password": process.env.PASSWORD, // Your Base64 encoded password from Safaricom
    "Timestamp": new Date().toISOString().replace(/[-:T.Z]/g, '').slice(0, 14), // Current timestamp
    "TransactionType": "CustomerPayBillOnline",
    "Amount": amount,
    "PartyA": phoneNumber,
    "PartyB": 174379,
    "PhoneNumber": phoneNumber,
    "CallBackURL": "https://mydomain.com/path", // Your callback URL
    "AccountReference": "CompanyXLTD",
    "TransactionDesc": "Payment of X"
  };

  // Send the STK Push request
  unirest('POST', 'https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest')
    .headers({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${process.env.ACCESS_TOKEN}`, // Use your generated access token here
    })
    .send(JSON.stringify(requestBody))
    .end(response => {
      if (response.error) {
        console.error('STK Push Error:', response.error);
        return res.status(500).json({ error: response.error });
      }
      console.log('STK Push Response:', response.body);
      res.json(response.body);
    });
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
