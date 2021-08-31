const Dispatcher = require('../lib/dispatcher');

describe('dispatcher.js', () => {
  describe('Dispatcher', () => {
    describe('when have one subscriber', () => {
      let subscriber;

      beforeEach(() => {
          subscriber = jest.fn();

          Dispatcher.register(subscriber, 'event1');
      });

      it('should call subscriber', (done) => {
        const payload = {name: 'test'};
        Dispatcher.dispatch('event1', payload);

        process.nextTick(() => {
          expect(subscriber.mock.calls.length).toBe(1);
          expect(subscriber.mock.calls[0][0]).toBe('event1');
          expect(subscriber.mock.calls[0][1]).toBe(payload);
          done();
        });
      });

      describe('unregister', () => {
        beforeEach(() => {
           Dispatcher.unregister(subscriber);
        });

        it('should not call subscriber', (done) => {
          const payload = {name: 'test'};
          Dispatcher.dispatch('event1', payload);

          process.nextTick(() => {
            expect(subscriber.mock.calls.length).toBe(0);
            done();
          });
        });

        it('should ignore undefined unsubscriber', () => {
          Dispatcher.unregister();
        });
      });
    });

    describe('when subscriber has update function', () => {
        let subscriber;

        beforeEach(() => {
           subscriber = {update: jest.fn()};

           Dispatcher.register(subscriber, 'event2');
        });

      it('should call update function', (done) => {
        Dispatcher.dispatch('event2', 'payload');

        process.nextTick(() => {
          expect(subscriber.update.mock.calls.length).toBe(1);
          expect(subscriber.update.mock.calls[0][0]).toBe('event2');
          expect(subscriber.update.mock.calls[0][1]).toBe('payload');
          done();
        });
      });
    });

    describe('same subscriber for multiple events', () => {
      let subscriber;

      beforeEach(() => {
         subscriber = jest.fn();

         Dispatcher.register(subscriber, ['event3', 'event4']);
      });

      describe('dispatch event3', () => {
        beforeEach(() => {
           Dispatcher.dispatch('event3', 'test 3');
        });

        it('should call subscriber', (done) => {
          process.nextTick(() => {
            expect(subscriber.mock.calls.length).toBe(1);
            expect(subscriber.mock.calls[0][0]).toBe('event3');
            expect(subscriber.mock.calls[0][1]).toBe('test 3');
            done();
          });
        });
      });

      describe('dispatch event4', () => {
        beforeEach(() => {
          Dispatcher.dispatch('event4', 'test 4');
        });

        it('should call subscriber', (done) => {
          process.nextTick(() => {
            expect(subscriber.mock.calls.length).toBe(1);
            expect(subscriber.mock.calls[0][0]).toBe('event4');
            expect(subscriber.mock.calls[0][1]).toBe('test 4');
            done();
          });
        });
      });

      describe('unregister event3', () => {
          beforeEach(() => {
             Dispatcher.unregister(subscriber, ['event3', 'event5']);
          });

        describe('dispatch event3', () => {
          beforeEach(() => {
            Dispatcher.dispatch('event3', 'test 3');
          });

          it('should not call subscriber', (done) => {
            process.nextTick(() => {
              expect(subscriber.mock.calls.length).toBe(0);
              done();
            });
          });
        });

        describe('dispatch event4', () => {
          beforeEach(() => {
            Dispatcher.dispatch('event4', 'test 4');
          });

          it('should call subscriber', (done) => {
            process.nextTick(() => {
              expect(subscriber.mock.calls.length).toBe(1);
              expect(subscriber.mock.calls[0][0]).toBe('event4');
              expect(subscriber.mock.calls[0][1]).toBe('test 4');
              done();
            });
          });
        });
      });
    });
  });
});