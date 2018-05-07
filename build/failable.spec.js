'use strict';

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

const equal = require('assert').deepEqual;
const { throws } = require('assert');
const {
  success,
  failure,
  empty,
  isFailure,
  isSuccess,
  isEmpty,
  isFailable,
  payload,
  meta,
  assertSuccess,
  assertFailure,
  assertEmpty,
  anyFailed,
  firstFailure,
  makeItFailable,
  hydrate
} = require('./failable');

describe('success', () => {
  const box = success('foo');
  it('should be a success', () => {
    equal(isSuccess(box), true);
  });
  it('should not be a failure', () => {
    equal(isFailure(box), false);
  });
  it('should not be empty', () => {
    equal(isEmpty(box), false);
  });
  it('should have the correct payload', () => {
    equal(payload(box), 'foo');
  });
  it('should have the correct meta', () => {
    equal(meta(box), undefined);
  });
  it('should return empty if no payload is provided', () => {
    const emptyBox = success();
    equal(isEmpty(emptyBox), true);
  });
  it('should hydrate correctly', () => {
    equal(hydrate(box), { kind: 'success', payload: 'foo' });
  });
});

describe('failure', () => {
  const error = failure('bad');
  it('should not be a success', () => {
    equal(isSuccess(error), false);
  });
  it('should be a failure', () => {
    equal(isFailure(error), true);
  });
  it('should not be empty', () => {
    equal(isEmpty(error), false);
  });
  it('should have the correct payload', () => {
    equal(payload(error), 'bad');
  });
  it('should have the correct meta', () => {
    equal(meta(error), undefined);
  });
  it('should hydrate correctly', () => {
    equal(hydrate(error), { kind: 'failure', payload: 'bad' });
  });
});

describe('empty', () => {
  const missing = empty('meta');
  it('should be a success', () => {
    equal(isSuccess(missing), true);
  });
  it('should not be a failure', () => {
    equal(isFailure(missing), false);
  });
  it('should be empty', () => {
    equal(isEmpty(missing), true);
  });
  it('should have no payload', () => {
    equal(payload(missing), undefined);
  });
  it('should have the correct meta', () => {
    equal(meta(missing), 'meta');
  });
  it('should hydrate correctly', () => {
    equal(hydrate(missing), { kind: 'empty', meta: 'meta' });
  });
});

describe('payload', () => {
  it('should return the payload of a failable', () => {
    const data = 'I am a payload';
    const failable = success(data);
    const result = payload(failable);
    equal(result, data);
  });
});

describe('isFailable', () => {
  it('should pass a success', () => {
    equal(isFailable(success('')), true);
  });
  it('should pass a failure', () => {
    equal(isFailable(failure()), true);
  });
  it('should pass an empty', () => {
    equal(isFailable(empty()), true);
  });
  it('should fail a non-array', () => {
    equal(isFailable({ foo: 'bar' }), false);
    equal(isFailure(undefined), false);
    equal(isSuccess('s'), false);
    equal(isEmpty(7), false);
  });
  it('should fail a non-failable array', () => {
    equal(isFailable([4, 5, 6]), false);
  });
});

describe('assertSuccess', () => {
  it('should pass success', () => {
    assertSuccess(success(''));
  });
  it('should fail failure', () => {
    throws(() => assertSuccess(failure()));
  });
  it('should pass empty', () => {
    assertSuccess(empty());
  });
  it('should pass success with correct payload', () => {
    assertSuccess(success('foo'), 'foo');
  });
  it('should fail success with wrong payload', () => {
    throws(() => assertSuccess(success('foo'), 'bar'));
  });
});

describe('assertFailure', () => {
  it('should fail success', () => {
    throws(() => assertFailure(success('')));
  });
  it('should pass failure', () => {
    assertFailure(failure());
  });
  it('should fail empty', () => {
    throws(() => assertFailure(empty()));
  });
  it('should pass failure with correct payload', () => {
    assertFailure(failure('foo'), 'foo');
  });
  it('should fail failure with wrong payload', () => {
    throws(() => assertFailure(failure('foo'), 'bar'));
  });
});

describe('assertEmpty', () => {
  it('should fail success', () => {
    throws(() => assertEmpty(success('')));
  });
  it('should fail failure', () => {
    throws(() => assertSuccess(failure()));
  });
  it('should pass empty', () => {
    assertEmpty(empty());
  });
});

describe('anyFailed', () => {
  it('should return true if list contains a failure', () => {
    const list = [success(''), success(''), empty(), failure()];
    equal(anyFailed(list), true);
  });
  it('should return false if list contains no failures', () => {
    const list = [success(''), success(''), empty(), empty()];
    equal(anyFailed(list), false);
  });
});

describe('firstFailure', () => {
  it('should return the first failure', () => {
    const list = [success(), failure('1'), empty(), failure('2')];
    const first = firstFailure(list);
    equal(payload(first), '1');
  });
});

describe('makeItFailable', () => {
  it('should return failable when fn returns one', _asyncToGenerator(function* () {
    const expected = success('hello');
    const testFn = (() => {
      var _ref2 = _asyncToGenerator(function* () {
        return expected;
      });

      return function testFn() {
        return _ref2.apply(this, arguments);
      };
    })();
    const stillFailable = makeItFailable(testFn);
    const result = yield stillFailable();
    equal(result, expected);
  }));

  it('should return failable when fn does not return one', _asyncToGenerator(function* () {
    const expected = success('hello');
    const testFn = (() => {
      var _ref4 = _asyncToGenerator(function* () {
        return 'hello';
      });

      return function testFn() {
        return _ref4.apply(this, arguments);
      };
    })();
    const nowFailable = makeItFailable(testFn);
    const result = yield nowFailable();
    equal(result, expected);
  }));

  it('should return a failable if the fn throws an error', _asyncToGenerator(function* () {
    const testFn = function () {
      return Promise.reject('no work');
    };
    const failableFailure = makeItFailable(testFn);
    const result = yield failableFailure();
    assertFailure(result, 'no work');
  }));
});