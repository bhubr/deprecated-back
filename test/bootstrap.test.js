import server from '../server';
import event from '../services/event-hub';

before(done => {
  event.init();
  event.hub().on('app:ready', () => { console.log('app READY'); done(); });
});
