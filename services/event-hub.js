import EventEmitter from 'events';

export default {
  eventHub: null,

  init() {
    this.eventHub = new EventEmitter;
    this.eventHub.on('event', () => {
      console.log('an event occurred!', arguments, this);
    });
  },

  hub() {
    return this.eventHub;
  }
}