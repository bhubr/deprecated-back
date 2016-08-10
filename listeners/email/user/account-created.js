import mailgun from '../../../services/mailgun';

module.exports = {
  handle(data) {
    // console.log('email:user:account-created', data);
    mailgun.send(data);
  }
}