# Another ExpressJS backend

## Changelog

* 2016/08/09
	* Use [Node DB Migration framework](https://github.com/db-migrate/node-db-migrate). Doc is [here](https://db-migrate.readthedocs.io/en/latest/).

## TODO

* Introduce generic mechanism to insert models [done]
* Allow different setups when testing (e.g. port 3001, sqlite db, etc.)

## Design

### Auth module

#### Back-end

The backend part must handle 7 requests:
- (POST) register
- (POST) confirm email
- (POST) login (open session)
- (POST) logout (close session)
- (GET)  session status
- (POST) ask for pass reset
- (POST) pass reset

## Notes

* Inspiration to setup the tests right:
  * [Testing Sails.js](http://sailsjs.org/documentation/concepts/testing)
  * [Ensuring Express App is running before each Mocha Test](http://stackoverflow.com/questions/18941736/ensuring-express-app-is-running-before-each-mocha-test)