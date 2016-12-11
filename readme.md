# fs-lotus

**Sugar to open and close a file descriptor.**

[![npm status](http://img.shields.io/npm/v/fs-lotus.svg?style=flat-square)](https://www.npmjs.org/package/fs-lotus) [![node](https://img.shields.io/node/v/fs-lotus.svg?style=flat-square)](https://www.npmjs.org/package/fs-lotus) [![Travis build status](https://img.shields.io/travis/vweevers/fs-lotus.svg?style=flat-square&label=travis)](http://travis-ci.org/vweevers/fs-lotus) [![AppVeyor build status](https://img.shields.io/appveyor/ci/vweevers/fs-lotus.svg?style=flat-square&label=appveyor)](https://ci.appveyor.com/project/vweevers/fs-lotus) [![Dependency status](https://img.shields.io/david/vweevers/fs-lotus.svg?style=flat-square)](https://david-dm.org/vweevers/fs-lotus)

## usage

```js
const open = require('fs-lotus')
    , fs = require('fs')

const readExactly = function (filename, pos, length, done) {
  open(filename, 'r', function (err, fd, close) {
    if (err) return done(err)

    fs.read(fd, Buffer(length), 0, length, pos, function (err, bytesRead, buf) {
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

This pattern ensures that our `readExactly` function doesn't leak fd's.

```js
readExactly('readme.md', 0, 10, function (err, buf) {
  console.log(buf.toString()) // '# fs-lotus'
})

readExactly('readme.md', 1e5, 10, function (err, buf) {
  console.log(err.toString()) // 'Error: End of file'
})
```

## install

With [npm](https://npmjs.org) do:

```
npm install fs-lotus
```

## license

[MIT](http://opensource.org/licenses/MIT) © Vincent Weevers
