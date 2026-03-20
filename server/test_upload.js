const jwt = require('jsonwebtoken');
const axios = require('axios');
const fs = require('fs');
const FormData = require('form-data');
require('dotenv').config();

const token = jwt.sign({ id: '60c72b2f9b1d8b001c8e4a99' }, process.env.JWT_SECRET, { expiresIn: '1h' });

const form = new FormData();
form.append('title', 'Test Item');
form.append('description', 'Test Description');
form.append('category', 'Electronics');
form.append('basePrice', '100');
fs.writeFileSync('dummy.jpg', 'fake image content');
form.append('images', fs.createReadStream('dummy.jpg'), { filename: 'dummy.jpg', contentType: 'image/jpeg' });

axios.post('http://localhost:5000/api/seller/items', form, {
  headers: {
    ...form.getHeaders(),
    Authorization: 'Bearer ' + token
  }
}).then(res => {
  console.log('SUCCESS:', res.data);
}).catch(err => {
  console.log('ERROR:', err.response ? err.response.data : err.message);
});
