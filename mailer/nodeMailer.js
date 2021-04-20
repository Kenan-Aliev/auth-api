const nodemailer = require('nodemailer')

module.exports = nodemailer.createTransport({
        host: 'smtp.mail.ru',
        port: 465,
        secure: true, // true for 465, false for other ports
        auth: {
            user: 'eventmaker_48@mail.ru',
            pass: 'kenan484837'
        }
    }, {
        from: 'Event Maker <eventmaker_48@mail.ru>'
    }
);