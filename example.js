var hyperdrive = require('hyperdrive')
var discovery = require('hyperdiscovery')
var trimetDat = require('.')

var appID = '' // GET your trimet app id

var archive = hyperdrive('./data')
archive.ready(function () {
  discovery(archive)
  console.log('discovery', archive.key.toString('hex'))
})

var trimet = trimetDat(archive, {appID: appID})
trimet.fetch(function (err) {
  if (err) throw err
  console.log('done')
})
