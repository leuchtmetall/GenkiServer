var bonjour = require('bonjour')();
var config = require('../config');
var exports = module.exports = {};

var clients = {};

// testing
bonjour.find({ type: config.zeroconfTypeServer }, function (service) {
  console.log('Found a server:', service)
})

var browser = bonjour.find({ type: config.zeroconfTypeContent }, function (service) {
  console.log('Found a content server:', service, "adding ", serviceKey(service))
  clients[serviceKey(service)] = {
    host: {
      hostname: service.host,
      port: service.port,
      path: '/contentPing',
      agent: false
    },
    deviceName: service.txt.devname
  }
})

browser.on('down', function(service) {
  console.log('Lost a content server:', service, "removing ", serviceKey(service))
  clients[serviceKey(service)] = undefined;
})

exports.getHostnameAndPort = function(deviceName) {
  var hosts = new Set;
  for (var clientId in clients) {
    if (clients.hasOwnProperty(clientId)) {
      let client = clients[clientId];
      if(client != undefined && (deviceName.toLowerCase() == 'all' || client.deviceName == deviceName)) {
        console.log("added client " + client.deviceName + ' to return list');
        hosts.add(client)
      }
    }
  }
  // hosts.add({hostname: 'abc.local', port: '3333', path: '/somewhere', agent: false}); // for testing
  return hosts;
}

function serviceKey(service) {
  return service.host + ":" + service.port + " as " + service.name;
}