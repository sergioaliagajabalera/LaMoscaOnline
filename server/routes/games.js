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
        let addplayer={player:player,rol:'admin',cards:[]}
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
      let addplayer={player:player,rol:'guest',cards:[]}   
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
    if(game.length!=0 && game.size==lenghtplayers) {
      let data= new Date();
      let hour=data.getHours()+':'+data.getMinutes()+':'+data.getSeconds;
      game.start_d=hour;
      console.log(games);
      console.log('start game');
      io.to(roomcode).emit('startsuccessful','Start Game');
    }   
};