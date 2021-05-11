//server for vue front La Mosca Online
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var PORT = process.env.PORT || 4000;
var app = express();
var cors= require('cors');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//request since outside of the server| configuration
app.use(function(req,res,next){
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Request-Method', '*');
  res.setHeader('Access-Control-Allow-Methods', 'OPTIONS, GET,POST');
  res.setHeader('Access-Control-Allow-Headers', '*');
  next();
});

app.use(cors())
app.options('*', cors())


//mongodb connection
var mysql = require('mysql'); 
var db = mysql.createConnection({
  host     : 'localhost',
  user     : 'adminlamoscaonline',
  password : 'adminlamoscaonline',
  database : 'lamoscaonline',
  port: 3306
});

//md5 hash
var md5 = require('md5');


//routes imports
var playersRouter = require('./routes/players');



//array's objects exports
var players=playersRouter.players;






//use path request control
app.get('/hello', function(req, res) {
  res.send('hello world');
});
  //general
  app.post('/login', playersRouter.login(db,md5,players));
  app.post('/register', playersRouter.register(db,md5,players));
  app.post('/logout', playersRouter.logout(players));
  //game
  









// catch 404 and forward to error handler
app.use(function(req, res, next) {
    next(createError(404));
  });
  
  // error handler
  app.use(function(err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};
  
    // render the error page
    res.status(err.status || 500);
    res.send('error');
  });
  
  
  if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
      res.send('error');
    });
  }
  module.exports = app;





app.listen(PORT, () => console.log(`Server running on port ${PORT}`));