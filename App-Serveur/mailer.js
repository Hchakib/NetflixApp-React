const nodemailer = require('nodemailer');

const transport = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: 'YOUR_GMAIL_ADDRESS',
        pass: 'YOUR_GMAIL_PASSWORD'
    }
});

module.exports = transport;
