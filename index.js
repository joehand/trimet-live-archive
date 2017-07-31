var assert = require('assert')
var fs = require('fs')
var request = require('request')
var ndjson = require('ndjson')
var pump = require('pump')
var debug = require('debug')('trimet-live-archive')

module.exports = function (archive, opts) {
  if (!opts) {
    opts = archive
    archive = fs
  }
  assert.ok(opts.appID, 'trimet appID required')

  var appID = opts.appID || process.env.APP_ID
  var liveURL = `https://developer.trimet.org/ws/v2/vehicles?appID=${appID}`
  var file = opts.dataFile || '/vehicles.json'

  return {
    fetch: function (cb) {
      if (!cb) cb = function (err) { debug('[ERROR]', err) }
      debug('fetching data', liveURL)

      request(liveURL, {json: true}, function (err, response, body) {
        if (err || response.statusCode !== 200) return cb(err)
        var vehicleData = body.resultSet.vehicle
        debug('received data, vehicles:', vehicleData.length)

        var serialize = ndjson.serialize()
        var ws = archive.createWriteStream(file)
        pump(serialize, ws, cb)

        // make to stream
        vehicleData.map(function (vehicle) {
          // skip buses that don't have a next stop or route number
          if (!vehicle.nextStopSeq || !vehicle.routeNumber) return

          // whitelist some properties for now
          // see details:
          //   https://developer.trimet.org/ws_docs/vehicle_locations_ws.shtml
          var data = {
            id: vehicle.vehicleID,
            time: vehicle.time,
            longitude: vehicle.longitude,
            latitude: vehicle.latitude,
            type: vehicle.type,
            routeNumber: vehicle.routeNumber,
            sign: vehicle.signMessage,
            delay: vehicle.delay,
            inCongestion: vehicle.inCongestion,
            loadPercentage: vehicle.loadPercentage,
            direction: vehicle.direction,
            beaing: vehicle.bearing
          }

          if (!opts.geojson) return serialize.write(data)
          serialize.write({
            type: 'Feature',
            geometry: {
              type: 'Point',
              coordinates: [data.longitude, data.latitude]
            },
            properties: data
          })
        })
        serialize.end()
      })
    }
  }
}
