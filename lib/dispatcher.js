const Dispatcher = {

  observers: {undefined: []},

  register: function(observer, eventType) {
    const self = this;
    const eventTypes = _toArray(eventType);
    eventTypes.forEach((type) => {
      if (!self.observers[type]) {
        self.observers[type] = [];
      }
      self.observers[type].push(observer);
    });
  },

  unregister: function(observer, eventType) {
    if (observer === undefined) {
      return;
    }
    if (eventType === undefined) {
      eventType = Object.keys(this.observers);
    }

    const self = this;
    const eventTypes = _toArray(eventType);
    eventTypes.forEach((type) => {
      self._getObserversBy(type).forEach((item, index, array) => {
        if (item === observer) {
          array.splice(index, 1);
        }
      });
    });
  },

  dispatch: function(eventType, obj) {
    const observers = this._getObserversBy(undefined).concat(this._getObserversBy(eventType));
    observers.forEach((observer) => {
      process.nextTick(() => {
        if (observer.update) {
          observer.update(eventType, obj);
        } else {
          observer(eventType, obj);
        }
      });
    });
  },

  _getObserversBy: function(eventType) {
    return this.observers[eventType] || [];
  }
}

function _toArray(item) {
  if (item instanceof Array) {
    return item;
  } else {
    return [item];
  }
}

module.exports = Dispatcher;
