# trimet-live-archive

get live trimet vehicle data into a dat

* adds to files, `raw.json` and `vehicles.json`. 
* `raw.json` is the raw response
* `vehicles.json` is parsed data to ndjson geosjon values

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

## API

### `var trimet = trimetDat(archive, opts)`

* `archive`: hyperdrive archive
* `opts.appID`: required trimet app id

#### `trimet.fetch(cb)`

Fetch live vehicle data! Writes to archive files.

## License

[MIT](LICENSE.md)
