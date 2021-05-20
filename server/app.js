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
var gamesRouter = require('./routes/games');
var skillsRouter = require('./routes/skills');

//array's objects exports
var players=playersRouter.players;
var games=gamesRouter.games;
var skills=skillsRouter.skills;




//use path request control
app.get('/hello', function(req, res) {
  res.send('hello world');
});
  //general
  app.post('/login', playersRouter.login(db,md5,players,skills));
  app.post('/register', playersRouter.register(db,md5,players));
  app.post('/logout', playersRouter.logout(players,skills));
  //game





//socket.io connections on and emit
const io = require('socket.io')({cors: {origin: "*"}});

io.on('connection', client => {
    
  //listening sockets and call methods routes
  client.on('createGame', function(form){
      console.log(form);
      gamesRouter.createGame(client,form,games);
      console.log("skillssssssssssssssssssssssssssssssssssssssssssssssssss");
      console.log(skills);
  });

  client.on('joinGame', function(form){
    console.log(form);
    gamesRouter.joinGame(client,io,form,games);
  });

  client.on('startGame', function(form){
    console.log(form);
    gamesRouter.startGame(io,form,games);
  });

  client.on('getstatusGame', function(form){
    console.log(form);
    gamesRouter.getstatusGame(client,io,form,games);
  });

  client.on('getcheckturnround', function(){
    gamesRouter.getcheckturnround(client,io,games);
  });

  //actionsgames sockets on
  client.on('mosca', function(){
    gamesRouter.mosca(client,io,games);
  });
  client.on('checkwinnerstartinprocess', function(){
    var winnercheck= gamesRouter.checkwinnerstartinprocess(client,io,games);
    var game=winnercheck.game;
    var winner=winnercheck.winner;
    let roomcode=winnercheck.roomcode;
 
    var onlyInA = game.players.filter(playersRouter.comparer(winner));
                                      //it get the difference beetwen winner array and game array for get of the lossers 
    var onlyInB = winner.filter(playersRouter.comparer(game.players));
    var lossers = onlyInA.concat(onlyInB);//get difference

    
    //update skills players
    lossers.forEach(a => skillsRouter.gamefinished(db,skills,a.player,0,'loss'));
    winner.forEach(a => skillsRouter.gamefinished(db,skills,a.player,a.award,'win'));

    //delete game
    var indexn=games.indexOf(game);
    games.splice(indexn,1);

    //emit winner 
    var form={winner:winner};
    io.to(roomcode).emit('winnersuccessful',form);
    
    
  });
  client.on('startDrag', function(form){
    console.log(form);
    gamesRouter.startDrag(client,io,form,games);
  });
  client.on('endDrag', function(form){
    console.log(form);
    let roomcode=client.roomcode;
    io.to(roomcode).emit('endDragsuccessful',form);
  });
  client.on('onDrop', function(form){
    console.log(form);
    gamesRouter.onDropcard(client,io,form,games);
  });
  client.on('giveCard', function(){
    gamesRouter.giveCard(client,io,games);
  });
  client.on('throwCard', function(form){
    gamesRouter.throwCard(client,io,form,games);
  });
  client.on('viewCard', function(form){
    gamesRouter.viewCard(client,io,form,games);
  });
  client.on('giveCardtoanother', function(form){
    gamesRouter.giveCardtanother(client,io,form,games);
  });
  client.on('changeCardwithoutsee', function(form){
    gamesRouter.changeCardwithoutsee(client,io,form,games);
  });
  client.on('showCardschangesee', function(form){
    gamesRouter.showCardschangesee(client,io,form,games);
  });
});

io.listen(8888);







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