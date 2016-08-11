import EventEmitter from 'events';
import path         from 'path';

// function getListeners() {
//   const files = fs.readdirSync(listenersDir);
//   let _listeners = {};
//   files.forEach(file => {
//     const modelName = path.basename(file, '.js');
//     const modelDefinition = require(modelsDir + '/' + file);
//     _models[modelName] = modelDefinition;
//   });
//   for (let modelName in _models) {
//     models[modelName] = ormize(modelName, _models[modelName]);
//   }
//   return models;
// }

export default {
  eventHub: null,
  listenersDir: path.normalize(__dirname + '/../listeners'),
  eventListenersMap: require('./event-listeners.json'),
  loadedListeners: {},

  loadListener(listener) {
    if(this.loadedListeners[listener] === undefined) {
      this.loadedListeners[listener] = require(this.listenersDir + '/' + listener).handle;
    }
    return this.loadedListeners[listener];
  },

  bindListeners() {
    console.log(this.eventListenersMap);
    for (const event in this.eventListenersMap) {
      const listeners = this.eventListenersMap[event];
      listeners.forEach(listener => {
        this.eventHub.on(event, this.loadListener(listener));
      });
    }
    console.log(this.loadedListeners);
  },

  init() {
    if (this.eventHub !== null) {
      console.log('Event hub already initialized, skip!');
      return;
    }
    console.log('Event hub initializing');
    
    this.eventHub = new EventEmitter;
    this.eventHub.on('event', () => {
      console.log('an event occurred!', arguments, this);
    });
    this.bindListeners();
  },

  hub() {
    return this.eventHub;
  }
}