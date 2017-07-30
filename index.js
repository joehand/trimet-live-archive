var assert = require('assert')
var request = require('request')
var ndjson = require('ndjson')
var pump = require('pump')
var debug = require('debug')('trimet-live-archive')

module.exports = function (archive, opts) {
  assert.ok(archive, 'archive required')
  var appID = opts.appID || process.env.APP_ID
  var liveURL = `https://developer.trimet.org/ws/v2/vehicles?appID=${appID}`

  return {
    fetch: function (cb) {
      debug('fetching data', liveURL)
      request(liveURL, {json: true}, function (err, response, body) {
        if (err || response.statusCode !== 200) return cb(err)
        var vehicleData = body.resultSet.vehicle
        debug('received data, vehicles:', vehicleData.length)

        archive.writeFile('raw.json', body, function (err) {
          if (err) return cb(err)
          var serialize = ndjson.serialize()
          var ws = archive.createWriteStream('vehicles.json')
          pump(serialize, ws, cb)

          vehicleData.map(function (vehicle) {
            var coordinates = [vehicle.longitude, vehicle.latitude]
            var geojson = {
              'type': 'Feature',
              'geometry': {
                'type': 'Point',
                'coordinates': coordinates
              },
              'properties': vehicle
            }
            serialize.write(geojson)
          })
          serialize.end()
        })
      })
    }
  }
}
