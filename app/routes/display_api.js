var express = require('express');
var router = express.Router();
var fs = require('fs-extra');
var sanitize = require("sanitize-filename");
var utils = require('../lib/utils');
var config = require('../config');

// Every content display related HTTP-Request from the devices should go through this.

router.get('/:device_name/content.:format', function(req, res, next) {
  var format = req.params.format;
  var deviceName = req.params.device_name;
  var token = req.query.token;
  var filename = 'content.' + format;
  console.log(config.contentDisplayPath + deviceName + '('+sanitize(deviceName)+'), format: ' + format + ', token: ' + token);

  if(utils.checkToken(deviceName, token)) {
    utils.respondToChallenge(req, res);
    var dir = config.contentDisplayPath + sanitize(deviceName);
    fs.ensureDirSync(dir, function (err) { console.log('error ensuring directory', err)});
    var allDir = config.contentDisplayPath + 'all';
    if(utils.fileExists(allDir + '/emergency.' + format)) {
      req.url = '/all/emergency.' + format;
      next();
    } else if (utils.fileExists(dir + '/' + filename)) {
      next();
    // } else if(utils.getLastModified(allDir + '/' + filename) > utils.getLastModified(dir + '/' + filename)) {
    } else if (utils.fileExists(allDir + '/' + filename)) {
      req.url = '/all/' + filename;
      next();
    } else {
      res.status(404).send('404');
    }
  } else {
      console.log('UNAUTHORIZED')
      res.status(401).send('...');
  }
});

router.get('/', function(req, res, next) {
  utils.respondToChallenge(req, res);
  res.send('');
})

module.exports = router;





