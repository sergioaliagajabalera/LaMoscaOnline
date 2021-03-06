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
        var gametemp=games.find(a=>a.players.find(a=>a.player==player));//maybe the player is in another game
        if(gametemp==undefined) {
          var game=new Game(roomcode,map,sizeroom)
          let addplayer={player:player,rol:'admin',cards:new Array()}
          game.players.push(addplayer);
          games.push(game);
          console.log(games);
          client.join(roomcode);
          client.username=player;
          client.roomcode=roomcode;
          client.rol='admin';
          console.log("createGame")
          client.emit('createsuccessful',roomcode);
        }
      } catch (error) {
          
      }
  };

exports.joinGame=function(client,io,form,games) {//parameter "form" get values to   socket of the client
  try {
    //get values for initialize variables
    let player=form.player; 
    let roomcode=form.roomcode;

    var gametemp=games.find(a=>a.players.find(a=>a.player==player));//maybe the player is in another game
    if(gametemp==undefined){
      var game=games.find(a=>a.roomcode==roomcode);
      if(game!=undefined) {
        if(game.start_d==null){
          if(game.getNumberplayer(player)==-1 && game.players.length<game.size_g ){//maybe the player want join but the game already started or full
            let addplayer={player:player,rol:'guest',cards:new Array()}   
            game.players.push(addplayer);  
            console.log(games);
            client.join(roomcode);
            client.username=player;
            client.roomcode=roomcode;
            client.rol='guest';
            console.log("joinGame")
            io.to(roomcode).emit('joinsuccessful',game.getAllplayers());
          }
        }
      }
    }   
  } catch (error) {

  }   
};

exports.startGame=function(io,form,games) {//parameter "form" get values to   socket of the client
    //get values for initialize variables
    let lenghtplayers=form.playerlenght; 
    let roomcode=form.roomcode;
    var game=games.find(a=>a.roomcode==roomcode);
    console.log(lenghtplayers);
    if(game!=undefined) {
      if(game.size_g==lenghtplayers){
        let data= new Date();
        let hour=data.getHours()+':'+data.getMinutes()+':'+data.getSeconds();
        console.log(hour)
        console.log(data.getHours());
        game.start_d=hour;
        game.dividedcards();
        game.cardlast=game.giveCard();
        game.cardsecondlast=game.cardlast;
        game.tempcheckstart=true;
        console.log(io.sockets.adapter.rooms);
        console.log('start game');
        io.to(roomcode).emit('startsuccessful','Start Game');
      };     
    };
};

exports.getstatusGame=function(client,io,form,games) {//parameter "form" get values to   socket of the client
  //get values for initialize variables
  let roomcode=form.roomcode;
  let player=form.player;
  var game=games.find(a=>a.roomcode==roomcode);
  if(game!=undefined) {
    client.join(roomcode);
    client.username=player;
    client.roomcode=roomcode;
    if(io.sockets.adapter.rooms.get(roomcode).size==game.players.length) game.tempcheckstart=false; 
    console.log(game);
    console.log("get status");
    console.log(game.players[0].cards);
    console.log(io.sockets.adapter.rooms);
    let form2={'game':game,'players':game.getAllplayers()}
    io.to(roomcode).emit('getstatussuccessful',form2);
  }
};

exports.getcheckturnround=function(client,io,games) {//parameter "form" get values to   socket of the client
  //get values for initialize variables
  let roomcode=client.roomcode;;
  let player=client.username;;
  
  var game=[];
  game=games.find(a=>a.roomcode==roomcode);
  if(game!=undefined) {
    let playern=game.getNumberplayer(player);
    if(game.turn>=playern && game.turn!=-1)if(game.round>=1)client.emit('getcheckturnroundsuccessful');
  }
};

//giveCard
exports.mosca=function(client,io,games) {
  //get values for initialize variables
  let roomcode=client.roomcode;
  let playerAction=client.username;

  console.log(roomcode);
  var game=games.find(a=>a.roomcode==roomcode);
  if(game!=undefined){
    let playernaction=game.getNumberplayer(playerAction);
    if(game.mosca==false){
      if(game.turn==playernaction){
        if(game.round>1){
          let playernaction=game.getNumberplayer(playerAction);
          game.changeturn(client);
          game.moscafinish(playernaction);
          io.to(roomcode).emit('moscasuccessful')
          let form1={'game':game,'players':game.getAllplayers()}
          io.to(roomcode).emit('getstatussuccessful',form1);
        }else{
          let form3={error:'it too much quickly, it wait to have less points and it will highest possibility of win'};
          client.emit('errormessagesocket',form3)
        }    
      }else{
        let form2={error:'Is not your turn'};
        client.emit('errormessagesocket',form2);
      }
    }else{
      let form4={error:'Has already been call the Mosca'};
      client.emit('errormessagesocket',form4);
    }
  }
};

exports.checkwinnerstartinprocess=function(client,io,games) {
  //get values for initialize variables
  let roomcode=client.roomcode;;
  let player=client.username;;
  
  var game=[];
  game=games.find(a=>a.roomcode==roomcode);
  if(game!=undefined) {
    var winner=game.checkwinner(io,roomcode);
    var form={winner:winner,game:game,roomcode:roomcode};
    return form;
  }else return -2;
};
  
  //startdrag
  exports.startDrag=function(client,io,form,games) {//parameter "form" get values to  socket of the client
    //get values for initialize variables
    let roomcode=client.roomcode;
    let playerAction=client.username;
    let playerCardmove=form.playerCardmove;
    let cardn=form.cardn;

    console.log(roomcode);
    var game=games.find(a=>a.roomcode==roomcode);
    
    if(game!=undefined) {
      var playernaction=game.getNumberplayer(playerAction);
      if(game.playernmosca!=playerCardmove && game.playernmosca!=playernaction){
        var checkdropcorrect=game.checkdropcorrect(playerCardmove,cardn);
        if(checkdropcorrect==3){//if player action drag card is not equal to last card, receive card more
          let card=game.giveCard();
          if(card!=-2){
            let playernaction=game.getNumberplayer(playerAction);
            game.collectCard(playernaction,card);
            let form3={'game':game,'players':game.getAllplayers()};
            io.to(roomcode).emit('getstatussuccessful',form3);
          }else client.emit('checkwinnerstart',{interval:2500});
        }
        var imagesrc=game.getCardsrc(playerCardmove,cardn);
        console.log(imagesrc);
        let form2={imageshow:imagesrc,player:playerCardmove,cardn:cardn};
        io.to(roomcode).emit('showcardsuccessful',form2);
      }
    }
  };

  //ondrop
  exports.onDropcard=function(client,io,form,games) {//parameter "form" get values to socket of the client
    //get values for initialize variables
    let roomcode=client.roomcode;
    let playerCardmove=form.playerCardmove;
    let cardn=form.cardn;

    console.log(roomcode);
    var game=games.find(a=>a.roomcode==roomcode);

    
    if(game!=undefined && game.playernmosca!=playerCardmove && game.playernmosca!=playernaction) {
      var playernaction=game.getNumberplayer(client.username);
      if(game.playernmosca!=playerCardmove && game.playernmosca!=playernaction) {
        var checkdropcorrect=game.checkdropcorrect(playerCardmove,cardn);
        if(checkdropcorrect==1){//if player action drag card is equal to last card and different the secondlast, drop card
          game.dropCard(playerCardmove,cardn);
          console.log(game.cardlast+"|"+game.cardsecondlast);   
          if(client.username!=game.players[playerCardmove].player){//if drop card of another user, emit to give one card to other player
            let form3={giveCardtoplayer:game.players[playerCardmove].player};
            client.emit('giveOneCardtoanothermovement',form3);
          }
          let form2={'game':game,'players':game.getAllplayers()}
          io.to(roomcode).emit('getstatussuccessful',form2);
        }
      }
    }
  };
  
  //giveCard
  exports.giveCard=function(client,io,games) {//parameter "form" get values to socket of the client
    //get values for initialize variables
    let roomcode=client.roomcode;
    let playerAction=client.username;

    console.log(roomcode);
    var game=games.find(a=>a.roomcode==roomcode);
    if(game!=undefined ) {
      let playernaction=game.getNumberplayer(playerAction);
      if(game.playernmosca!=playernaction) {
        if( game.turn!=-1){
          if(game.turn==playernaction){
            var card=game.giveCard();
            if(card!=-2){
              let form={card:card};
              client.emit('givecardsuccessful',form)
            }else client.emit('checkwinnerstart',{interval:0});
          }else{
            let form2={error:'Is not your turn'};
            client.emit('errormessagesocket',form2);
          }
        }else {
            let form3={error:'Game is finalize, it can'+"' "+'t take cards'};
            client.emit('errormessagesocket',form3);
        };
      }
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
    if(game!=undefined) {
      let playernaction=game.getNumberplayer(playerAction);
      if(game.playernmosca!=playern && game.playernmosca!=playernaction) {
        if(action==0){//if change and throw card, movement special(not)
          game.changeandthrowcollectCard(playern,cardnchange,card);
          game.changeturn(client);
          game.draw2={playern:playern, cardn:cardnchange}
        }else{
          console.log('entra accion 1');
          game.dropCard(playern,-1,card);
          console.log(card);
          if(card.v==7 || card.v==8)client.emit('viewyourcardmovementspecial');
          else if(card.v==9 || card.v==10)client.emit('viewcardanotherplayermovementspecial');
          else if(card.name.includes("J-") || card.name.includes("Queen-")) client.emit('changecardwithoutseemovementspecial');
          else if(card.name.includes("King-")) client.emit('changecardseemovementspecial');
          else game.changeturn(client);
        };
        
        let form2={'game':game,'players':game.getAllplayers()}
        console.log(game.cards.length);
        io.to(roomcode).emit('getstatussuccessful',form2);
        game.draw2={playern:-1, cardn:-1}
      }
    }
  };

//viewCard
exports.viewCard=function(client,io,form,games) {//parameter "form" get values to   socket of the client
  //get values for initialize variables
  var roomcode=client.roomcode;
  var playern=form.playern;
  var cardn=form.cardn;
  var action=form.action;
  
  console.log(roomcode);
  var game=games.find(a=>a.roomcode==roomcode);
  if(game!=undefined) {
    var imagesrc=game.getCardsrc(playern,cardn);
    console.log(imagesrc);
    
    
    if(action!=2){
      game.changeturn(client);
      game.draw1={playern:playern, cardn:cardn}
      let form3={'game':game,'players':game.getAllplayers()}
      io.to(roomcode).emit('getstatussuccessful',form3); 
      game.draw1={playern:-1, cardn:-1};
    }
      
    let form2={imageshow:imagesrc,player:playern,cardn:cardn,action:1};
    client.emit('showcardsuccessful',form2);
    
  }
};

//giveCard
exports.giveCardtanother=function(client,io,form,games) {//parameter "form" get values to socket of the client
  //get values for initialize variables
  var roomcode=client.roomcode;
  var playerAction=client.username;
  var playern=form.playern;
  var cardn=form.cardn;
  var playerReceive=form.playerreceive;

  console.log(roomcode);
  var game=games.find(a=>a.roomcode==roomcode);
  if(game!=undefined) {
    var playerReceiven=game.getNumberplayer(playerReceive);
    game.giveCardtoanother(playern,cardn,playerReceiven);
    client.emit('giveCardtoanothersuccessful')
    let form2={'game':game,'players':game.getAllplayers()}
    io.to(roomcode).emit('getstatussuccessful',form2);
  }
};

//giveCard
exports.changeCardwithoutsee=function(client,io,form,games) {//parameter "form" get values to socket of the client
  //get values for initialize variables
  var action=form.action;
  var roomcode=client.roomcode;
  var playeractionnchange=form.playeractionnchange;
  var cardnactionchange=form.cardnactionchange;
  var playernchange=form.playernchange;
  var cardnchange=form.cardnchange;
  console.log(roomcode);
  var game=games.find(a=>a.roomcode==roomcode);
  if(action!=0){
    if(game.length!=0) {
      game.changecardtoanotherplayer(playeractionnchange,cardnactionchange,playernchange,cardnchange);
      game.draw1={playern:playeractionnchange, cardn:cardnactionchange}
      game.draw2={playern:playernchange, cardn:cardnchange}
    }
  }
  game.changeturn(client);
  let form2={'game':game,'players':game.getAllplayers()}
  io.to(roomcode).emit('getstatussuccessful',form2);
  game.draw1={playern:-1, cardn:-1}
  game.draw2={playern:-1, cardn:-1}
};

exports.showCardschangesee=function(client,io,form,games) {//parameter "form" get values to   socket of the client
  //get values for initialize variables
  var roomcode=client.roomcode;
  var playeractionnchange=form.playeractionnchange;
  var cardnactionchange=form.cardnactionchange;
  var playernchange=form.playernchange;
  var cardnchange=form.cardnchange;
  
  console.log(roomcode);
  var game=games.find(a=>a.roomcode==roomcode);
  if(game!=undefined) {
    var imagesrc1=game.getCardsrc(playeractionnchange,cardnactionchange);
    var imagesrc2=game.getCardsrc(playernchange,cardnchange);
    game.draw1={playern:playeractionnchange, cardn:cardnactionchange}
    game.draw3={playern:playernchange, cardn:playernchange}

    let form3={'game':game,'players':game.getAllplayers()}
    io.to(roomcode).emit('getstatussuccessful',form3);
    game.draw1={playern:-1, cardn:-1};
    game.draw3={playern:-1, cardn:-1};

    let form2={imageshow1:imagesrc1,imageshow2:imagesrc2};
    client.emit('showcardchangesuccessful',form2)



  }
};