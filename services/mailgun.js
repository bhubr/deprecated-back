const conf = require('../config.json').mailgun;
const mailgun = require('mailgun-js')(conf);
console.log(conf);

export default {

  sendEmail: function(user) {
    var data = {
      from: 'Excited User <me@samples.mailgun.org>',
      to: 'benoithubert@gmail.com',
      subject: 'Hello',
      text: 'Testing some Mailgun awesomness! User ' + user.email + ' just registered!'
    };

    mailgun.messages().send(data, function (error, body) {
      console.log(body);
    });
  }
}
