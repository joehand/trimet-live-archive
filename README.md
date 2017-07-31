# trimet-live-archive

get live trimet vehicle data into a dat or regular fs file

* data parsed to ndjson values (optionally as geojson)

## Install

```
npm install trimet-live-archive
```

## Usage


See `example.js` for full example.

* Sign up for trimet API & Get `appID`.
* Create a hyperdrive archive to write to

```js
var trimetDat = require('trimet-live-archive')

var archive = hyperdrive('./data')
var appID = 'YOUR_APP_ID'

var trimet = trimetDat(archive, {appID: appID})
trimet.fetch(function (err) {
  if (err) throw err
  console.log('done')
})

```

#### Using Regular Fs

You can write to a regular fs file too!

```js
var trimetDat = require('trimet-live-archive')
var appID = 'YOUR_APP_ID'

var trimet = trimetDat({appID: appID, dataFile: 'data.json'})
trimet.fetch(function (err) {
  if (err) throw err
  console.log('done')
})
```

## API

### `var trimet = trimetDat(archive, opts)`

* `archive`: hyperdrive archive or fs
* `opts.appID`: required trimet app id
* `opts.geojson`: write data as geojson
* `opts.dataFile`: path to write json data to

#### `trimet.fetch(cb)`

Fetch live vehicle data! Writes to archive files.

### Debugging

Use `DEBUG=trimet-live-archive` when running the process.

## License

[MIT](LICENSE.md)
