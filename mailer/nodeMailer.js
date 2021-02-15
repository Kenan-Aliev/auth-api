const nodemailer = require('nodemailer')

module.exports = nodemailer.createTransport({
        host: 'smtp.mail.ru',
        port: 465,
        secure: true, // true for 465, false for other ports
        auth: {
            user: 'mailertest48@mail.ru',
            pass: 'Nodemailer'
        }
    }, {
        from: 'Mailer Test <mailertest48@mail.ru>'
    }
);