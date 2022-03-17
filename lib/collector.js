const Collector = function (callback, events) {
  const pool = [];
  let timeout = undefined;

  return {
    timeout: function (duration) {
      timeout = duration;
      return this;
    },
    update: function (eventType, object) {
      let handled = false;
      let triggered = -1;

      for (let i = 0; i < pool.length; i++) {
        const item = pool[i];

        if (!item[eventType]) {
          item[eventType] = { value: object };
          handled = true;
        }

        if (Object.keys(item).filter(name => name !== "$timeout").length === events.length) {
          if (item.$timeout) {
            clearTimeout(item.$timeout);
          }
          triggered = i;
          break;
        }
      }

      if (triggered > -1) {
        const item = pool[triggered];

        pool.splice(triggered, 1);
        setTimeout(() => {
          const values = getValues(item, events);
          callback(null, values);
        }, 0);
      }

      if (!handled) {
        const item = {};
        item[eventType] = { value: object };

        if (timeout) {
          item.$timeout = setTimeout(() => {
            const values = getValues(item, events);
            callback(new Error(`timeout after ${timeout}`), values);
          }, timeout);
        }

        pool.push(item);
      }
    },
    events: function () {
      return events;
    }
  };
};

function getValues(item, events) {
  const values = {};

  events.forEach(event => {
    if (item[event] !== undefined) {
      values[event] = item[event].value;
    }
  });

  return values;
}

module.exports = Collector;
