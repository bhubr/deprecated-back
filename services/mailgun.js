import tokenService from './token';
import fs from 'fs';
import path    from 'path';
const conf = require('../config.json').mailgun;
const mailgun = require('mailgun-js')(conf);

const templatePath = path.normalize(__dirname + '/../resources/templates/email.html');
const template = fs.readFileSync(templatePath);

export default {

  send: function(params) {
    const data = {
      from: 'MyApp <benoithubert@samples.mailgun.org>',
      to: params.user.email, // 'benoithubert@gmail.com',
      subject: 'Hello',
      // text: 'Testing some Mailgun \nWelcome, ' + params.user.email + ', you just registered to my new super app.\n' + params.link
      html: template.toString()
    };

    console.log(data);
    // return;

    mailgun.messages().send(data, function (error, body) {
      console.log(error);
      console.log(body);
    });
  }
}
