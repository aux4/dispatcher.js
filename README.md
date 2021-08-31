# dispatcher.js

This package is responsible for managing events.

## Install

```shell script
npm install @aux4/dispatcher.js
```

## Register
Start listening events.

### Register for single event

```javascript
const {Dispatcher} = require('@aux4/dispatcher.js');

const MY_EVENT = 'my-event-name';

function subscriber(eventType, object) {
  console.log(eventType, object);
}

Dispatcher.register(subscriber, MY_EVENT);
```

### Register for multiple events

The subscriber will be triggered in case of any of these events will be dispatch.

```javascript
const Events = {
  EVENT_ONE: 'eventOne',
  EVENT_TWO: 'eventTwo'
};

Dispatcher.register(subscriber, [Events.EVENT_ONE, Events.EVENT_TWO]);
```

### Register for all events

The subscriber will be triggered in case of any events will be dispatch.

```javascript
Dispatcher.register(subscriber);
```

### Register for combined events

The subscriber will be triggered only after all events will be dispatch.

```javascript
const {Dispatch, Collector} = require('@aux4/dispatcher.js');

const collector = new Collector(subscriber, [Events.EVENT_ONE, Events.EVENT_TWO]);

Dispatch.reigster(collector, collector.events());
```

A timeout can be specified in case one of the events is missing.

```javascript
const {Dispatch, Collector} = require('@aux4/dispatcher.js');

const collector = new Collector(subscriber, [Events.EVENT_ONE, Events.EVENT_TWO]).timeout(1000); // 1s timeout

Dispatch.reigster(collector, collector.events());
```

## Dispatch
Dispatch event with (or without) a payload and it will trigger all registered subscribers for that particular event.

```javascript
// dispatch with payload
const payload = {...}; // it can be any object or value
Dispatcher.dispatch(Events.EVENT_ONE, payload);

// dispatch without payload
Dispatcher.dispatch(Events.EVENT_ONE);
```

## Unsubscribe
Stop listening events.

```javascript
// unregister for single event
Dispatcher.unregister(subscriber, MY_EVENT);

// unregister for multiple events
Dispatcher.unregister(subscriber, [Events.EVENT_ONE, Events.EVENT_TWO]);

// unregister for all events
Dispatcher.unregister(subscriber);
```