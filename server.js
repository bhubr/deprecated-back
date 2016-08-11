import Promise      from 'bluebird';
import express      from 'express';
import passport     from 'passport';
import bodyParser   from 'body-parser';
import cookieParser from 'cookie-parser';
import session      from 'express-session';
import ORM          from 'ormist';
import event        from './services/event-hub';

const config = require(__dirname + '/config.json');
const app    = express();

event.init();

app.use(cookieParser());
app.use(bodyParser.json({ type: 'application/*+json' }))  // Ember adapter uses vnd.api+json
app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: config.secureCookies }
}))
app.use(passport.initialize());
app.use(passport.session());


app.use('/activities', require('./routes/activities'));
app.use('/users', require('./routes/users'));
app.use('/auth', require('./routes/auth'));

if (config.debugMode) {
  app.use('/debug', require('./routes/debug'));
}

Promise.all([
  ORM.init(config.db.driver, config.db.settings)
])
.then(() => {
  app.listen(3000, function () {
    console.log('Example app listening on port 3000!');
    console.log('## server');
    event.hub().emit('app:ready');
  });
});

module.exports = app;