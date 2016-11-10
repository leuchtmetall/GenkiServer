"use strict"
var chokidar = require('chokidar');
var touch = require("touch");
var http = require('http');
var path = require('path');

module.exports = function(content_main_path, zeroconf_discovery) {
	console.log("CONTENT MAIN PATH " + content_main_path);

  let ignoreOnce = new Set;
	const watcher = chokidar.watch(content_main_path, {
    ignored: /[\/\\]\./,
    persistent: true,
    ignoreInitial: true,
    awaitWriteFinish: {
      stabilityThreshold: 1000,
      pollInterval: 100
    },
  });
  watcher.on('add', filepath => {
    touchFile(filepath);
  }).on('change', filepath => {
    touchFile(filepath);
  }).on('unlink', filepath => {
    notifyDevices(filepath);
  }).on('addDir', filepath => {
    console.log(`Directory ${filepath} has been added`)
  }).on('error', err => {
    console.log("ERROR: ", err);
  });

  function touchFile(filepath) {
    console.log("Path: " + filepath);

    if(ignoreOnce.has(filepath)) {
      console.log(`File ${filepath} has been added or changed. ignoring once...`)
      ignoreOnce.delete(filepath);
    } else {
      console.log(`File ${filepath} has been added or changed.`)
      ignoreOnce.add(filepath);
      touch(filepath);
      notifyDevices(filepath);
    }
  }

  function notifyDevices(filepath) {
    var pathComponents = filepath.split(path.sep);
    var deviceName = pathComponents[pathComponents.length - 2]
    zeroconf_discovery.getHostnameAndPort(deviceName).forEach(function(h) {
      console.log("notifying " + h.host.hostname + " ("+deviceName+") on port " + h.host.port);
      http.get(h.host, (res) => {
        console.log("sucessfully notified " + h.host.hostname + " ("+deviceName+") on port " + h.host.port);
      }).on('error', function(err) {
        console.error('Error nofifying device:', err.message);
      });
    });
  }

}



