var fs = require('fs-extra');
var crypto = require('crypto');
var secrets = require('../secrets');
var naturalSort = require('javascript-natural-sort');
naturalSort.insensitive = true;

var utils = {};

utils.getLastModified = function(path) {
  try {
    if (fs.existsSync(path)) {
      return fs.statSync(path).mtime;
    }
  } catch(err) { console.log("error getting last modified timestamp", err)}
  return 0;
}

utils.fileExists = function(path) {
  try {
    fs.statSync(path);
    return true;
  } catch (err) {
    return false;
  }
}

utils.getExtension = function(path) {
  if(path == null) {
    return null;
  }
  return path.split('.').pop();
}

utils.isDirectory = function(path) {
  try {
    return fs.statSync(path).isDirectory();
  } catch (e) {
    return false;
  }
}

utils.getNewestFile = function(path, arrayOfFiles) {
  path += '/';
  if(arrayOfFiles.length == 0) {
    return null;
  }
  return arrayOfFiles.reduce((prev, curr) => {
        if (utils.getLastModified(path + prev) > utils.getLastModified(path + curr)) {
          return prev;
        } else {
          return curr;
        }
      });
}

utils.checkToken = function(deviceName, token) {
  return utils.getToken(deviceName) === token;
}

utils.getToken = function(deviceName) {
  return utils.sha1sum(secrets.deviceTokenSecret + encodeURIComponent(deviceName));
}


utils.sha1sum = function(input){
    return crypto.createHash('sha1').update(input).digest('hex');
}

utils.generateChallengeResponse = function(challenge) {
  return utils.sha1sum(secrets.serverAuthSecretPre + challenge + secrets.serverAuthSecretPost);
}

utils.respondToChallenge = function(req, res) {
  var challenge = req.get('X-Genki-Challenge');
  var response = utils.generateChallengeResponse(challenge);
  res.set("X-Genki-Response", response);
}


const sortRegex = /[\uff01-\uff5e]/g;
function toHalfWidth(s) {
  return s.replace(sortRegex, function(ch) { return String.fromCharCode(ch.charCodeAt(0) - 0xfee0); } );
}
utils.naturalSort = function(a, b) {
  return naturalSort(toHalfWidth(a), toHalfWidth(b));
}


 utils.stripTrailingSlash = function(str) {
    if(str.substr(-1) === '/') {
        return str.substr(0, str.length - 1);
    }
    return str;
}

module.exports = utils;
