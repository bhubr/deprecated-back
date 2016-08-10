import tokenService from './token';
const conf = require('../config.json').mailgun;
const mailgun = require('mailgun-js')(conf);
console.log(conf);

export default {

  sendEmail: function(user) {
    const token = tokenService.gen();
    const link = 'http://localhost:4200/auth/confirm-email?token=' + token;
    const data = {
      from: 'MyApp <benoithubert@samples.mailgun.org>',
      to: user.email, //'benoithubert@gmail.com',
      subject: 'Hello',
      text: 'Testing some Mailgun \nWelcome, ' + user.email + ', you just registered to my new super app.\n' + link
    };

    mailgun.messages().send(data, function (error, body) {
      console.log(body);
    });
  }
}
