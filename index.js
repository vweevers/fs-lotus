'use strict';

const fs = require('fs')
    , combine = require('combine-errors')

module.exports = function open (file, flags, mode, done) {
  if (typeof mode === 'function') {
    done = mode, mode = undefined
  }

  fs.open(file, flags, mode, (err, fd) => {
    if (err) return done(err)

    done(null, fd, function close (done, err) {
      const args = Array.from(arguments).slice(1)

      fs.close(fd, function (closeErr) {
        if (err) done(closeErr ? combine([err, closeErr]) : err)
        else if (closeErr) done(closeErr)
        else done.apply(null, args)
      })
    })
  })
}
