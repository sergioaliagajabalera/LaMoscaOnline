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
      let hour=data.getHours()+':'+data.getMinutes()+':'+data.getSeconds();
      console.log(hour)
      console.log(data.getHours());
      game.start_d=hour;
      game.dividedcards();
      game.cardlast=game.giveCard();
      game.cardsecondlast=game.cardlast;
      console.log(io.sockets.adapter.rooms);
      console.log('start game');
      io.to(roomcode).emit('startsuccessful','Start Game');
    }   
};

exports.getstatusGame=function(client,io,form,games) {//parameter "form" get values to   socket of the client
  //get values for initialize variables
  let roomcode=form.roomcode;
  let player=form.player;
  console.log("eieruetruggg");
  console.log(form);
  var game=games.find(a=>a.roomcode==roomcode);
  if(game.length!=0) {
    client.join(roomcode);
    client.username=player;
    client.roomcode=roomcode;
    console.log(game);
    console.log(io.sockets.adapter.rooms);
    console.log("get status");
    console.log(game.players[0].cards);
    let form={'game':game,'players':game.getAllplayers()}
    io.to(roomcode).emit('getstatussuccessful',form);
  }
};
  
  
  //startdrag
  exports.startDrag=function(client,io,form,games) {//parameter "form" get values to   socket of the client
    //get values for initialize variables
    let roomcode=client.roomcode;
    let playerAction=form.playerAction;
    let playerCardmove=form.playerCardmove;
    let cardn=form.cardn;

    console.log(roomcode);
    var game=games.find(a=>a.roomcode==roomcode);
    if(game.length!=0) {
      var imagesrc=game.getCardsrc(playerCardmove,cardn);
      console.log(imagesrc);
      let form={imageshow:imagesrc,player:playerCardmove,cardn:cardn};
      io.to(roomcode).emit('showcardsuccessful',form);
    }
  };

  //ondrop
  exports.onDropcard=function(client,io,form,games) {//parameter "form" get values to   socket of the client
    //get values for initialize variables
    let roomcode=client.roomcode;
    let playerAction=form.playerAction;
    let playerCardmove=form.playerCardmove;
    let cardn=form.cardn;

    console.log(roomcode);
    var game=games.find(a=>a.roomcode==roomcode);
    if(game.length!=0) {
      game.dropCard(playerCardmove,cardn);
      console.log(game.cardlast+"|"+game.cardsecondlast);
      let form={game:game};
      io.to(roomcode).emit('getstatussuccessful',form);
    }
  };
  
  //giveCard
  exports.giveCard=function(client,io,games) {//parameter "form" get values to   socket of the client
    //get values for initialize variables
    let roomcode=client.roomcode;
    let playerAction=client.username;

    console.log(roomcode);
    var game=games.find(a=>a.roomcode==roomcode);
    if(game.length!=0) {
      var card=game.giveCard();
      let form={card:card};
      client.emit('givecardsuccessful',form)
    }
  };

   //throwCard
   exports.throwCard=function(client,io,form,games) {//parameter "form" get values to   socket of the client
    //get values for initialize variables
    var roomcode=client.roomcode;
    var playerAction=client.username;
    var playern=form.playern;
    var cardnchange=form.cardnchange;
    var action=form.action;
    var card=form.card;
    console.log(roomcode);
    var game=games.find(a=>a.roomcode==roomcode);
    if(game.length!=0) {
      if(action==0){//if change and throw card, moviment special(not)
        game.changeandthrowcollectCard(playern,cardnchange,card);
        game.changeturn();
      }else{
        console.log('entra accion 1');
        game.dropCard(playern,-1,card);
        
        if(card.v==7 || card.v==8)client.emit('viewyourcardmovimentspecial');
        else if(card.v==9 || card.v==10)client.emit('viewcardanotherplayermovimentspecial');
        else game.changeturn();
      };
      
      let form={game:game};
      console.log(game.cards.length);
      io.to(roomcode).emit('getstatussuccessful',form);
    }
  };

//viewCard
exports.viewCard=function(client,io,form,games) {//parameter "form" get values to   socket of the client
  //get values for initialize variables
  let roomcode=client.roomcode;
  let playern=form.playern;
  let cardn=form.cardn;

  console.log(roomcode);
  var game=games.find(a=>a.roomcode==roomcode);
  if(game.length!=0) {
    var imagesrc=game.getCardsrc(playern,cardn);
    console.log(imagesrc);
    
    let form={imageshow:imagesrc,player:playern,cardn:cardn,action:1};
    client.emit('showcardsuccessful',form)
    /*if(client.username==game.player[playern]){ //change the action property , depend of movement special if is for show card of the same user or another
      client.emit('showcardsuccessful',form)
    }else{
      client.emit('showcardsuccessful',form)
    };*/
    game.changeturn();
  }
};


