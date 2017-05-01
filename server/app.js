var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var db;
var MongoClient = require('mongodb').MongoClient;
MongoClient.connect('mongodb://admin:admin@ds019846.mlab.com:19846/bhakti',function(err,database){
  if(err){
    console.log("can not connect db");
    //throw 'db connection failed';
    return;
  }
  db = database;
  // console.log(db);

});

var routes = require('./routes/index');
var users = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
//app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);
app.use('/users', users);
app.get('/updateDB',function (req,res,next){
  // console.log(__dirname);
  res.sendFile(path.join(__dirname,'/public/index.html'));
});
app.get('/bhakti/:shlok', function (req, res, next) {
  db.collection('shlokList').find({name:req.params.shlok}).toArray(function(err, result) {
    console.log(result)
    res.json(result[0]);
  });
});

app.post('/createShlok', function(req,res,next){
  //console.log(req.body.shlokname);
  //console.log(req.body.shlok);
  var shlokname = req.body.shlokname;
  var title = req.body.shloktitle;
  var shlok = req.body.shlok.split(',');//JSON.parse(req.body.shlok);


  db.collection('shlokList').insert({name:shlokname, title:title, shlok:shlok}, function(err, result) {
    if (err) return console.log(err)

    console.log('saved to database')
    res.send('done');  
  })
  
});

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
