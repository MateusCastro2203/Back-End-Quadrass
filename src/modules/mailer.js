const path = require ('path')

const nodemailer = require('nodemailer');

const hbs = require('nodemailer-express-handlebars');

const {host, port, user, pass} = mailConfig = require('../config/mail.json');

var transport = nodemailer.createTransport({
    host,
    port,
    auth: {user, pass }
});

transport.use('compile', hbs({
    viewEngine: 'hendlebars',
    viewPath: path.resolve('./src/resource/mail/'),
    extName: '.htmml',
}))

module.exports = transport;