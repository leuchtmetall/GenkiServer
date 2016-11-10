"use strict";
var express = require('express');
var router = express.Router();
var fs = require('fs-extra');
var sanitize = require('sanitize-filename');
var utils = require('../lib/utils');
var config = require('../config');
var hidefile = require('hidefile');
const kpath = config.teachingMaterialsPath;

// Every teaching material related HTTP-Request from the devices should go through this.

router.get('/:path(*)', function(req, res, next) {
  utils.respondToChallenge(req, res);
  const originalPath = req.params.path;
  // remove path to parent and trailing slash
  const pathComponents = originalPath.split('/').filter(c => (!!c && c.length > 0 && c !== '..'));
  const path = pathComponents.join('/');
  // console.log('PATH COMPONENTS', pathComponents, ", PATH:", path);

  var format = req.query.format;

  const fullPath = kpath + path;
  if(utils.fileExists(fullPath)) {
    if(utils.isDirectory(fullPath)) { // is folder with subfolders
      var json = jsonForFolder(fullPath, true);
      console.log(json);
      if(format === 'html') {
        res.render('teaching_materials/index', { v: {pathComponents: pathComponents, path: path}, content: json, menu: 'materials', utils: utils });
      } else {
        res.json(json)
      }
    } else {
      next();
    }
  } else {
    res.status(404).send('404');
  }

  // res.send('path: ' + path + "<br>sani: " + sanitize(path));
});

// router.get('/', function(req, res, next) {
//   utils.respondToChallenge(req, res);
//   res.send('');
// })

module.exports = router;

const AUDIO = "audio";
const VIDEO = "video";
const SLIDESHOW = "slideshow";
const PRESENTATION = "presentation";
const FLASHCARDS = "flashcards";
const FOLDER = "folder";
const CONTENT_TYPES = [AUDIO, VIDEO, SLIDESHOW, PRESENTATION, FLASHCARDS, FOLDER];
const IMAGE_FILES = ["image.jpg", "image.png", "image.jpeg"];
const META_FILES = CONTENT_TYPES.concat(IMAGE_FILES);


function jsonForFolder(path, recursive) {
  path = utils.stripTrailingSlash(path);
  var files = fs.readdirSync(path);
  var pathComponents = path.split('/');
  var name = pathComponents[pathComponents.length-1];
  var returnValue = {name: name, image: null};
  var relevantFiles = files.filter(file => {
    var isHidden = false;
    try {
      isHidden = hidefile.isHiddenSync(file);
    } catch (e) {}
    return !META_FILES.includes(file) && !isHidden;
  })
  relevantFiles = relevantFiles.sort(utils.naturalSort);
  // console.log("path:", path, (recursive ? "RECURSIVE" : ""), "relevant files:", relevantFiles.join(', '));
  IMAGE_FILES.forEach(filename => {
    if (utils.fileExists(path + '/' + filename)) {
      returnValue.image = filename;
    }
  });

  let found = false;
  CONTENT_TYPES.forEach(kind => {
    if(files.includes(kind)) {
      returnValue.kind = kind;
      returnValue.contents = relevantFiles;
      found = true;
    } else if (!found && kind == FOLDER) {
      returnValue.kind = guessKindFromFiles(relevantFiles);
      if(returnValue.kind != null) {
        returnValue.contents = relevantFiles;
      } else {
        returnValue.kind = FOLDER;
        if(recursive) {
          const relevantFolders = relevantFiles.filter(file => utils.isDirectory(path + '/' + file) );
          returnValue.contents = relevantFolders.map(filename => jsonForFolder(path + '/' + filename, false) );
        }
      }
    }
  });
  return returnValue;
}

function guessKindFromFiles(files) {
  const extensions = files.map(filename => utils.getExtension(filename) );
  if(extensions.every(ext => ['mp3', 'ogg', 'm4a', 'aac', 'flac'].includes(ext))) {
    return AUDIO;
  } else if(extensions.every(ext => ['mp4', 'm4v', 'avi', 'webm', 'mov', 'MOV'].includes(ext))) {
    return VIDEO;
  } else if(extensions.every(ext => ['jpg', 'jpeg', 'png', 'pdf'].includes(ext))) {
    return PRESENTATION;
  }
  return null;
}



