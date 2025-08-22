require('dotenv').config();
const crypto = require('crypto');

const JWT_SECRET = process.env.JWT_SECRET || crypto.randomBytes(64).toString('hex');
const PORT = process.env.PORT || 3000;

module.exports = { JWT_SECRET, PORT };