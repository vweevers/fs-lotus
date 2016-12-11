'use strict';

const test = require('tape')
    , fs = require('fs')
    , open = require('.')

test('basic', function (t) {
  t.plan(6)

  const spies = {
    open: fsSpy('open'),
    close: fsSpy('close')
  }

  open(__filename, 'r', function (err, fd, close) {
    t.ifError(err, 'no open error')
    t.is(typeof fd, 'number', 'got fd')
    t.is(typeof close, 'function', 'got close function')

    t.same(spies.open.calls, [[__filename, 'r', undefined]])

    close(function (err) {
      t.ifError(err, 'no close error')
      t.same(spies.close.calls, [[fd]])

      spies.open.restore()
      spies.close.restore()
    })
  })
})

test('fs.close error', function (t) {
  t.plan(4)

  const spy = fsSpy('close', function wrap(original, fd, cb) {
    original(fd, function (err) {
      t.ifError(err, 'no actual error')
      cb(new Error('Mock error'))
    })
  })

  open(__filename, 'r', function (err, fd, close) {
    t.ifError(err, 'no open error')

    close(function (err) {
      t.is(err && err.message, 'Mock error', 'got mock error')
      t.same(spy.calls, [[fd]], 'fs.close was called with fd')

      spy.restore()
    })
  })
})

test('user error', function (t) {
  t.plan(4)

  const spy = fsSpy('close', function wrap(original, fd, cb) {
    original(fd, function (err) {
      t.ifError(err, 'no actual error')
      cb(null)
    })
  })

  open(__filename, 'r', function (err, fd, close) {
    t.ifError(err, 'no open error')

    close(function (err) {
      t.is(err && err.message, 'User error', 'got user error')
      t.same(spy.calls, [[fd]], 'fs.close was called with fd')

      spy.restore()
    }, new Error('User error'))
  })
})

test('combined error', function (t) {
  t.plan(4)

  const spy = fsSpy('close', function wrap(original, fd, cb) {
    original(fd, function (err) {
      t.ifError(err, 'no actual error')
      cb(new Error('Mock error'))
    })
  })

  open(__filename, 'r', function (err, fd, close) {
    t.ifError(err, 'no open error')

    close(function (err) {
      t.is(err && err.message, 'User error; Mock error', 'got both errors')
      t.same(spy.calls, [[fd]], 'fs.close was called with fd')

      spy.restore()
    }, new Error('User error'))
  })
})

test('variable arguments', function (t) {
  t.plan(2)

  open(__filename, 'r', function (err, fd, close) {
    t.ifError(err, 'no open error')

    close(function (err) {
      t.same(Array.from(arguments), [null, 1, 2, 3, 4])
    }, null, 1, 2, 3, 4)
  })
})

function fsSpy (method, wrap) {
  const original = fs[method]
      , calls = []

  fs[method] = function () {
    const args = Array.from(arguments)
    calls.push(args.slice(0, -1))

    if (wrap) wrap.apply(null, [original.bind(fs)].concat(args))
    else original.apply(fs, args)
  }

  return {
    calls,
    restore: function () {
      fs[method] = original
    }
  }
}
