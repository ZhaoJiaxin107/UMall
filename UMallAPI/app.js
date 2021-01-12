var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var detailRouter = require('./routes/detail');
var listRouter = require('./routes/list');
var { getMsg } = require('./utils/tool');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/image_source', express.static(path.join(__dirname, 'image_source')));

app.use('/', indexRouter);
app.use('/detail', detailRouter);
app.use('/list', listRouter);
// catch 404 and forward to error handler
app.use(function (req, res, next) {
  res.send(getMsg('File Not Found', 404))
});

// error handler
app.use(function (err, req, res, next) {
  res.send(getMsg(err, 500))
});

module.exports = app;
