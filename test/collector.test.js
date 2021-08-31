const Dispatcher = require('../lib/dispatcher');
const Collector = require('../lib/collector');

describe('dispatcher.js', () => {
  let collector, callback;

  beforeEach(() => {
    callback = jest.fn();
  });

  describe('timeout', () => {
    beforeEach(() => {
      collector = new Collector(callback, ['event1', 'event2']).timeout(100);

      Dispatcher.register(collector, collector.events())
    });

    describe('when dispatch event1', () => {
      beforeEach(() => {
        Dispatcher.dispatch('event1', 'test-one');
      });

      describe('after 100ms', () => {
        beforeEach((done) => {
          setTimeout(() => done(), 150);
        });

        it('should call callback with error', (done) => {
          process.nextTick(() => {
            expect(callback.mock.calls.length).toBe(1);
            expect(callback.mock.calls[0][0].message).toBe('timeout after 100');
            expect(callback.mock.calls[0][1].event1).toBe('test-one');
            done();
          });
        });
      });
    });
  });

  describe('no timeout', () => {
    beforeEach(() => {
      collector = new Collector(callback, ['event1', 'event2']).timeout(1000);

      Dispatcher.register(collector, collector.events())
    });

    describe('when dispatch event1', () => {
      beforeEach(() => {
        Dispatcher.dispatch('event1', 'test-one');
      });

      describe('when dispatch event2', () => {
        beforeEach(() => {
          Dispatcher.dispatch('event2', 'test-two');
        });

        it('should call callback', (done) => {
          process.nextTick(() => {
            process.nextTick(() => {
              expect(callback.mock.calls.length).toBe(1);
              expect(callback.mock.calls[0][0]).toBeNull();
              expect(callback.mock.calls[0][1].event1).toBe('test-one');
              expect(callback.mock.calls[0][1].event2).toBe('test-two');
              done();
            });
          });
        });
      });
    });
  });

  describe('collecting multiple events', () => {
    beforeEach(() => {
      collector = new Collector(callback, ['event1', 'event2']);

      Dispatcher.register(collector, collector.events())
    });

    describe('when dispatch event1', () => {
      beforeEach(() => {
        Dispatcher.dispatch('event1', 'test-one');
      });

      it('should not call callback', (done) => {
        process.nextTick(() => {
          expect(callback.mock.calls.length).toBe(0);
          done();
        });
      });

      describe('when dispatch another event1', () => {
        beforeEach(() => {
          Dispatcher.dispatch('event1', 'test-1');
        });

        it('should not call callback', (done) => {
          process.nextTick(() => {
            expect(callback.mock.calls.length).toBe(0);
            done();
          });
        });

        describe('when dispatch event2', () => {
          beforeEach(() => {
            Dispatcher.dispatch('event2', 'test-two');
          });

          it('should call callback', (done) => {
            process.nextTick(() => {
              process.nextTick(() => {
                expect(callback.mock.calls.length).toBe(1);
                expect(callback.mock.calls[0][0]).toBeNull();
                expect(callback.mock.calls[0][1].event1).toBe('test-one');
                expect(callback.mock.calls[0][1].event2).toBe('test-two');
                done();
              });
            });
          });

          describe('when dispatch another event2', () => {
            beforeEach(() => {
              Dispatcher.dispatch('event2', 'test-2');
            });

            it('should call callback', (done) => {
              process.nextTick(() => {
                process.nextTick(() => {
                  expect(callback.mock.calls.length).toBe(2);
                  expect(callback.mock.calls[1][0]).toBeNull();
                  expect(callback.mock.calls[1][1].event1).toBe('test-1');
                  expect(callback.mock.calls[1][1].event2).toBe('test-2');
                  done();
                });
              });
            });
          });
        });
      });
    });
  });
});