import mailgun from '../../../services/mailgun';

module.exports = {
  handle(data) {
    // console.log('email:user:account-created', data);
    data.link = {
      href: 'http://localhost:4200/auth/confirm-email?token=' + data.token.value,
      title: 'Confirm your email'
    };
    data.recipient = data.user.email;
    mailgun.send(data);
  }
}