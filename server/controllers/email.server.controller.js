const path = require('path'),
    fs = require('fs'),
    nodemailer = require('nodemailer'),
    smtpTransport = nodemailer.createTransport({
        from: process.env.MAILER_FROM,
        options: {
            host: process.env.MAILER_SERVICE_PROVIDER,
            port: 465,
            secure: true,
            auth: {
                user: process.env.MAILER_EMAIL_ID,
                pass: process.env.MAILER_PASSWORD
            }
        }
    });

exports.sendMail = function (data) {
    try {
        return new Promise((resolve, reject) => {
            var emailTemplate = path.resolve(data.template + '.html');
            fs.readFile(emailTemplate, 'utf8', function (err, templateHtml) {
                var attributes = data.attributes;
                for (var key in attributes) {
                    if (attributes.hasOwnProperty(key)) {
                        templateHtml = templateHtml.replace("{{" + key + "}}", attributes[key])
                        console.log(key + " -> " + attributes[key]);
                    }
                }
                var mailOptions = {
                    to: data.emailto,
                    from: process.env.MAILER_EMAIL_ID,
                    cc: data.cc || '',
                    subject: data.subject,
                    html: templateHtml,
                    attachments: data.attachments
                };
                console.log(mailOptions);
                smtpTransport.sendMail(mailOptions, function (err, done) {
                    console.log(err, done);
                    resolve(err, done);
                })
            });
        });
    } catch (err) {
        console.log(err);
    }
};