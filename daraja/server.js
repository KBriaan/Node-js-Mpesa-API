// require('dotenv').config();
// const express = require('express');
// const axios = require('axios');

// const app = express();
// app.use(express.json());

// app.post('/startTransaction', async (req, res) => {
//   const { amount, phoneNumber } = req.body;

  
//   const requestBody = {
//     "BusinessShortCode": 174379,
//     "Password": "MTc0Mzc5YmZiMjc5ZjlhYTliZGJjZjE1OGU5N2RkNzFhNDY3Y2QyZTBjODkzMDU5YjEwZjc4ZTZiNzJhZGExZWQyYzkxOTIwMjQwODA4MTgwMjQz",
//     "Timestamp": new Date().toISOString().replace(/[-:T.Z]/g, '').slice(0, 14), // Current timestamp
//     "TransactionType": "CustomerPayBillOnline",
//     "Amount": amount,
//     "PartyA": phoneNumber,
//     "PartyB": 174379,
//     "PhoneNumber": phoneNumber,
//     "CallBackURL": process.env.CAllBACK_URL, 
//     "AccountReference": "CompanyXLTD",
//     "TransactionDesc": "Payment of X"
//   };

//   try {
    
//     const response = await axios.post(
//       'https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest',
//       requestBody,
//       {
//         headers: {
//           'Content-Type': 'application/json',
//           'Authorization': `Bearer ${process.env.ACCESS_TOKEN}`, 
//         }
//       }
//     );

//     console.log('STK Push Response:', response.data);
//     res.json(response.data);
//   } catch (error) {
//     console.error('STK Push Error:', error.response ? error.response.data : error.message);
//     res.status(500).json({ error: error.response ? error.response.data : error.message });
//   }
// });

// const port = process.env.PORT || 3000;
// app.listen(port, () => {
//   console.log(`Server is running on port ${port}`);
// });


require('dotenv').config();
const express = require('express');
const axios = require('axios');

const app = express();
app.use(express.json());

// Function to get a new access token
async function getAccessToken() {
  const consumerKey = process.env.CONSUMER_KEY;
  const consumerSecret = process.env.CONSUMER_SECRET;
  const auth = Buffer.from(`${consumerKey}:${consumerSecret}`).toString('base64');

  try {
    const response = await axios.get(
      'https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials',
      {
        headers: {
          'Authorization': `Basic ${auth}`
        }
      }
    );
    return response.data.access_token;
  } catch (error) {
    console.error('Error fetching access token:', error.response ? error.response.data : error.message);
    throw new Error('Could not get access token');
  }
}

app.post('/startTransaction', async (req, res) => {
  const { amount, phone } = req.body;

  // Generate the request body for STK Push
  const requestBody = {
    "BusinessShortCode": 174379,
    "Password": "MTc0Mzc5YmZiMjc5ZjlhYTliZGJjZjE1OGU5N2RkNzFhNDY3Y2QyZTBjODkzMDU5YjEwZjc4ZTZiNzJhZGExZWQyYzkxOTIwMjQwODA4MTgwMjQz",
    "Timestamp": new Date().toISOString().replace(/[-:T.Z]/g, '').slice(0, 14), // Current timestamp
    "TransactionType": "CustomerPayBillOnline",
    "Amount": amount,
    "PartyA": phone,
    "PartyB": 174379,
    "PhoneNumber": phone,
    "CallBackURL": "https://mydomain.com/path", 
    "AccountReference": "CompanyXLTD",
    "TransactionDesc": "Payment of X"
  };

  try {
    // Get a new access token dynamically
    const accessToken = await getAccessToken();

    // Send the STK Push request
    const response = await axios.post(
      'https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest',
      requestBody,
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`,
        }
      }
    );

    console.log('STK Push Response:', response.data);
    res.json(response.data);
  } catch (error) {
    console.error('STK Push Error:', error.response ? error.response.data : error.message);
    res.status(500).json({ error: error.response ? error.response.data : error.message });
  }
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
