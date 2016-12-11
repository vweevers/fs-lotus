# fs-lotus

**Sugar to open and close a file descriptor.**

[![npm status](http://img.shields.io/npm/v/fs-lotus.svg?style=flat-square)](https://www.npmjs.org/package/fs-lotus) [![Travis build status](https://img.shields.io/travis/vweevers/fs-lotus.svg?style=flat-square&label=travis)](http://travis-ci.org/vweevers/fs-lotus) [![AppVeyor build status](https://img.shields.io/appveyor/ci/vweevers/fs-lotus.svg?style=flat-square&label=appveyor)](https://ci.appveyor.com/project/vweevers/fs-lotus) [![Dependency status](https://img.shields.io/david/vweevers/fs-lotus.svg?style=flat-square)](https://david-dm.org/vweevers/fs-lotus)

## usage

```js
const open = require('fs-lotus')
    , fs = require('fs')

function readExactly (filename, length, done) {
  open(filename, 'r', function (err, fd, close) {
    if (err) return done(err)

    fs.read(fd, Buffer(length), length, 4, 0, function (err, bytesRead, buf) {
      if (err) return close(done, err)

      if (bytesRead !== length) {
        return close(done, new Error('End of file'))
      }

      close(done, null, buf)
    })
  })
}
```

The `open` function has the same signature as [`fs.open(path, flags[, mode], callback)`](https://nodejs.org/api/fs.html#fs_fs_open_path_flags_mode_callback). Except that `callback` also receives a `close(callback, err, ...args)` function, which calls `fs.close` for you. An error from `fs.close` (if any) will be [combined](https://github.com/matthewmueller/combine-errors) with your error (if any).

## install

With [npm](https://npmjs.org) do:

```
npm install fs-lotus
```

## license

[MIT](http://opensource.org/licenses/MIT) © Vincent Weevers
