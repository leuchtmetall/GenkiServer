"use strict"
var express = require('express');
var router = express.Router();
var fs = require('fs-extra');
var utils = require ('../lib/utils')
var debug = require('debug')('myapp:controller');
var multer  = require('multer')
var upload = multer({ dest: 'upload_temp/' });
var sanitize = require("sanitize-filename");
var config = require('../config');
var cpath = config.contentDisplayPath;


/* GET home page. */
router.get('/', function(req, res, next) {
  var v = {error: null};
  v.abc = cpath;
  v.clients = findClients();
  v.emergencyContent = findEmergencyContent();
  var amf = activeEmergencyFile();
  var amfExt = utils.getExtension(amf);
  v.hasActiveEmergencyFile = (amf != null);
  v.activeEmergencyFile = v.emergencyContent.reduce((prev, curr) => {
    if(prev) { return prev; }
    if(amf == null) { return null; }

    if(fs.statSync(cpath + 'all/emergency.' + amfExt).size == fs.statSync(cpath + 'emergency_templates/' + curr).size) {
      return curr;
    }
  }, null);
  res.render('display/index', { v: v, menu: 'content', utils: utils });
});

/* Upload new File */
router.post('/upload', upload.single('newContent'), (req, res, next) => {
  var uploadSuccess = uploadToClient(req, req.body.client, req.file.mimetype);
  if(!uploadSuccess) {
    res.status(400).send('unsupported file type');
  } else if(req.body.redirect) { // no ajax
    res.redirect('/display/');
  } else {
    res.json({});
  }
});

/* Set Emergency Content */
router.post('/emergency', (req, res, next) => {
  var sourceFilename = cpath + 'emergency_templates/' + req.body.content;
  var destFilename = cpath + 'all/emergency.' + req.body.content.split('.').pop()
  if(req.body.content === 'off') {
    var f = activeEmergencyFile();
    if(f) {
      fs.unlinkSync(cpath + 'all/' + f);
      // todo notify clients on delete
    }
    res.redirect('/display/');
  } else { // copy file
    console.log('will copy', sourceFilename, '->', destFilename);
    fs.copy(sourceFilename, destFilename, err => {
      if(err) {
        console.log(error);
        res.status(400);
      } else {
        res.redirect('/display/');
      }
    });
  }
});

module.exports = router;


function uploadToClient(req, client, mimetype) {
  console.log(mimetype);
  var format = {'application/pdf': 'pdf', 'video/mp4': 'm4v'}[mimetype]
  if(typeof format === 'undefined') {
    console.log('unsupported file type');
    return false;
  }
  fs.ensureDir(cpath + sanitize(client), function (err) { });
  var newPath = cpath + sanitize(client) + "/content." + sanitize(format);
  console.log("new path:", newPath)

  fs.renameSync(req.file.path, newPath)
  return true;
}

function findClients() {
  var files = fs.readdirSync(cpath)
  var clientArray = files.filter(f => {
    return fs.statSync(cpath + f).isDirectory()
      && f !== 'emergency_templates';
  }).sort((a, b) => {
    if(a.toLowerCase() === 'all') {
      return -1;
    } else if(b.toLowerCase() == 'all') {
      return 1;
    } else {
      return a.localeCompare(b);
    }
  });

  clientArray = clientArray.map(f => {
    let newestFile = fs.readdirSync(cpath + f).filter(f => {
      return f.indexOf("content.") === 0 && utils.getExtension(f) !== 'txt';
    });
    if(newestFile.length > 0) {
      newestFile = utils.getNewestFile(cpath + f, newestFile);
    } else {
      newestFile = null;
    }
    return {
      name: f,
      file: newestFile,
      filetype: newestFile ? utils.getExtension(newestFile) : null
    };
  });
  return clientArray;
}

function findEmergencyContent() {
  const files = fs.readdirSync(cpath + 'emergency_templates').filter(f => {
    return config.displayFileTypes.indexOf(utils.getExtension(f)) >= 0;
  });
  return files;
}

function activeEmergencyFile() {
  const files = fs.readdirSync(cpath + 'all').filter(f => {
    return f.indexOf("emergency.") == 0;
  });
  return utils.getNewestFile(cpath + 'all', files);
}



