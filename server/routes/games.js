var express = require('express');
var router = express.Router();
var Game = require('../models/Game');

exports.games=[];

exports.createGame=function(client,form,games) {//parameter "form" get values to   socket of the client
      try {
        //get values for initialize variables
        let player=form.player; 
        let map=form.map;
        let sizeroom=form.size;
        let roomcode=player+''+Math.round(Math.random()*5999);//generate code room or game

        var game=new Game(roomcode,map,sizeroom)
        let addplayer={player:player,rol:'admin',cards:new Array()}
        game.players.push(addplayer);
        games.push(game);
        console.log(games);
        client.join(roomcode);
        client.username=player;
        client.rol='admin';
        console.log("createGame")
        client.emit('createsuccessful',roomcode);
      } catch (error) {
          res.send({ status: 0, error: error });
      }
  };

exports.joinGame=function(client,io,form,games) {//parameter "form" get values to   socket of the client
  try {
    //get values for initialize variables
    let player=form.player; 
    let roomcode=form.roomcode;

    var game=games.find(a=>a.roomcode==roomcode);
    if(game.length!=0) {
      let addplayer={player:player,rol:'guest',cards:new Array()}   
      game.players.push(addplayer);  
      console.log(games);
      client.join(roomcode);
      client.username=player;
      client.rol='guest';
      console.log("joinGame")
      io.to(roomcode).emit('joinsuccessful',game.getAllplayers());
    }   
  } catch (error) {
      res.send({ status: 0, error: error });
  }   
};

exports.startGame=function(io,form,games) {//parameter "form" get values to   socket of the client
    //get values for initialize variables
    let lenghtplayers=form.playerlenght; 
    let roomcode=form.roomcode;
    var game=games.find(a=>a.roomcode==roomcode);
    console.log(lenghtplayers);
    if(game.length!=0 && game.size_g==lenghtplayers) {
      let data= new Date();
      let hour=data.getHours()+':'+data.getMinutes()+':'+data.getSeconds;
      game.start_d=hour;
      game.dividedcards();
      console.log(io.sockets.adapter.rooms);
      console.log('start game');
      io.to(roomcode).emit('startsuccessful','Start Game');
    }   
};

exports.getstatusGame=function(client,io,form,games) {//parameter "form" get values to   socket of the client
  //get values for initialize variables
  let roomcode=form.roomcode;
  let player=form.player;
  console.log(roomcode);
  var game=games.find(a=>a.roomcode==roomcode);
  if(game.length!=0) {
    client.join(roomcode);
    client.username=player;
    console.log(io.sockets.adapter.rooms);
    console.log("get status");
    console.log(game.players[0].cards);
    let form={'game':game,'players':game.getAllplayers()}
    io.to(roomcode).emit('getstatussuccessful',form);
  }   
};
