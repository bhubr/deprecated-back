import server from '../server';
import event from '../services/event-hub';
import path from 'path';
import ORM from 'ormist';

global.config = require( path.normalize(__dirname + '/../config/dev.json') );
console.log(config);
before(done => {
  
  ORM.init(config.db.driver, config.db.settings)
  .then(() => {
  		event.init();
		event.hub().on('app:ready', () => { console.log('app READY'); done(); });
  });
  
});
