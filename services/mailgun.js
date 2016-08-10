import tokenService from './token';
const conf = require('../config.json').mailgun;
const mailgun = require('mailgun-js')(conf);
console.log(conf);

export default {

  sendEmail: function(params) {
    const data = {
      from: 'MyApp <benoithubert@samples.mailgun.org>',
      to: params.user.email, // 'benoithubert@gmail.com',
      subject: 'Hello',
      text: 'Testing some Mailgun \nWelcome, ' + params.user.email + ', you just registered to my new super app.\n' + params.link
    };

    console.log(data);
    // return;

    mailgun.messages().send(data, function (error, body) {
      console.log(error);
      console.log(body);
    });
  }
}
