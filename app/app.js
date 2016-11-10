"use strict";

require('./lib/polyfills.js');

var express = require('express');
var helmet = require('helmet');
var i18n = require('i18n-2');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var multer = require('multer');
var passport = require('passport');
var DigestStrategy = require('passport-http').DigestStrategy;
var app = express();
app.use(helmet());

require('use-strict');

var config = require('./config');
var secrets = require('./secrets');
var routes = require('./routes/index');
var display = require('./routes/display');
var display_api = require('./routes/display_api');
var teachingMaterials = require('./routes/teaching_materials');

var zeroconf = require('./lib/zeroconf_announce');
var zeroconf_discovery = require('./lib/zeroconf_discovery');
var display_watcher = require('./lib/content_display_watcher');

var pjson = require('./package.json');
app.locals.version = pjson.version;


// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));



// i18n configuration
i18n.expressBind(app, {
    locales: ['ja', 'en'],
    cookieName: 'locale'
});

app.use(function(req, res, next) {
  if(req.query.locale) {
    req.cookies.locale = req.query.locale
    res.cookie('locale', req.query.locale)
  }
  req.i18n.setLocaleFromCookie();
  // req.i18n.setLocaleFromSubdomain();
  req.app.locals.locale = req.i18n.getLocale();
  next();
});

display_watcher(config.contentDisplayPathShort, zeroconf_discovery);

// app.use(app.router);
app.use('/components', express.static(__dirname + '/bower_components'));
app.use(express.static(__dirname + '/public'));
app.use('/data', teachingMaterials);
app.use('/data', express.static(config.teachingMaterialsPath));
app.use('/datac', display_api);
app.use('/datac', express.static(__dirname + '/../content_display_data'));

// Passport authentication setup
app.use(passport.initialize());
app.use(passport.session());
passport.use(new DigestStrategy(
  function(username, cb) {
    if(username !== secrets.username) {
      return cb(null, false);
    }
    return cb(null, {name: username}, secrets.password);
  }
));
app.use(passport.authenticate('digest', {session: false}))


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');


app.use('/', routes);
app.use('/display', display);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace

if (app.get('env') === 'development') {
  // i18n.devMode = true;
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
