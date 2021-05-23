const cardsgenerics=require('../mocks/cards/generics/cardsgenerics');


module.exports = class Game {


    //this constructor is for register player
    constructor(roomcode,map,size_g) {
      this.roomcode= roomcode;
      this.players=new Array();
      this.map = map;
      this.size_g = size_g;
      this.start_d=null;
      this.finish_d=null;
      this.winner=null;
      this.cards=JSON.parse(JSON.stringify(cardsgenerics));
      this.round=0;
      this.turn=0;
      this.mosca=false;
      this.playernmosca=-1;
      //board
      this.cardlast=null;
      this.cardsecondlast=null;
      this.throwcard=false;//if is true not important if card drop is also to equal to secondlast
    }
  
    set name(value) {
        this._name = value
    }
    
    get name() {
        return this._name
    }

    moscafinish(playern){
      this.mosca=true;
      this.playernmosca=playern;
    }
    checkwinner(){
      this.turn=-1;
      console.log("THE WINNER IS!!!!!");
      var playerscheck=[]
      this.players.forEach(function(a,i){ 
        var mosca=false
        if(i==this.playernmosca) mosca=true;
        playerscheck.push({player:a.player,points:Object.values(a.cards).reduce((t, {v}) => t + v,0),cardsn:a.cards.length,mosca:mosca,tie:false})
        //get values of all players
      }.bind(this))
      console.log(playerscheck);
      console.log("ORDENING");
      playerscheck.sort(function(a, b){//---------------------LOGIC WIN or TIE (ordening)
        if(a.points<=b.points){
          if(a.mosca && a.points>=b.points)return 1;
          else if(b.mosca && b.points>=a.points)return -1;
          else if(a.points>b.points)return 1;
          else if(b.points>a.points)return -1;
          else{
            if (a.cardsn==b.cardsn && a.points==b.points ){
                a.tie=true;
                b.tie=true;
              }
            if(a.cardsn<b.cardsn && a.points<=b.points)return -1;
              else return 1;
          }
        }else return 1; 
      });
      console.log(playerscheck);
      console.log("points distribution");
      var award=4;
      var winnercheck=[];
      if(playerscheck[0].tie==true) winnercheck=playerscheck.filter(a=>a.tie==true);
      else winnercheck.push(playerscheck[0]);
      var distribution=parseInt((award/winnercheck.length).toFixed());//calculate award by the number players
      winnercheck.forEach(function(a,i){//distributation of award for every player 
        a.award=distribution;
      }.bind(this));
      console.log(winnercheck);
      return winnercheck;
    }

    getAllplayers(){
      var arrayplayers=[];
      this.players.forEach(a=>arrayplayers.push(a.player));
      return arrayplayers;
    }
    getNumberplayer(player){
      var playern=0;
      this.players.forEach(function(a,i){if(a.player==player){playern=i}})
      console.log(playern);
      return playern;
    }
    
    dividedcards(){
      const shuffledArray = this.cards.sort((a, b) => 0.5 - Math.random()); //shuffled cards depend on if number random generated is negative or positive
      this.cards=shuffledArray;
      this.players.forEach(function(a){ //it give 4 cards for every player
        for(let i=0; i<4; i++){
          var card=this.cards[i]
          this.cards.splice(i,1);
          a.cards.push(card);
        }
      }.bind(this))
    }

    //actions games
    getCardsrc(player,cardn){
      var card=null
      this.players.forEach(function(a,i){ //it give 4 cards for every player
        if(i==player) this.players[i].cards.forEach(function(a2,i2) {if(i2==cardn){ card=a2.image}});
      }.bind(this));
      return card;
    }
    giveCard(){
      if(this.cards.length!=0){ 
        var card=this.cards.shift();
        return card;
      }
      else return -2;
     
    }

    giveCardtoanother(playern,cardn,playerReceiven){
      const cardtemp=this.players[playern].cards[cardn];
      this.players[playern].cards.splice(cardn,1);
      this.players[playerReceiven].cards.push(cardtemp);
    }

    checkdropcorrect(playern,cardn){
        if(this.cardlast.v==this.players[playern].cards[cardn].v && (this.cardsecondlast.v!=this.players[playern].cards[cardn].v || this.throwcard==true)) return 1;
        else if(this.cardlast.v==this.players[playern].cards[cardn].v ) return 2;
        else return 3;
    }

    dropCard(player,cardn,card/*optional*/){
      if(this.round!=0) {
        this.cards.push(this.cardsecondlast);
        const shuffledArray = this.cards.sort((a, b) => 0.5 - Math.random()); //shuffled cards depend on if number random generated is negative or positive
        this.cards=shuffledArray;
      }else this.round+=1;

      console.log(this.cards.length);
      const cardtemp=this.cardlast;
      this.cardsecondlast=cardtemp;
      console.log(card);
      if(card==undefined){
        const cardtemp2=this.players[player].cards[cardn];
        this.cardlast=cardtemp2;
        this.players[player].cards.splice(cardn,1);
        this.throwcard=false;
      }else{
        this.throwcard=true;
        this.cardlast=card;
      }
      console.log(this.cards.length);
    }
    collectCard(player,card){//function throw collect card
      this.players[player].cards.push(card);
    }

    changeandthrowcollectCard(playern,cardnchange,card){//function for change collect card for another
        const cardchange=this.players[playern].cards[cardnchange];
        this.players[playern].cards[cardnchange]=card;
        this.dropCard(playern,card,cardchange);
    }
    changecardtoanotherplayer(playeractionnchange,cardnactionchange,playernchange,cardnchange){//function for change collect card for another
      const cardactionchange=this.players[playeractionnchange].cards[cardnactionchange];
      const cardchange=this.players[playernchange].cards[cardnchange];
      this.players[playeractionnchange].cards[cardnactionchange]=cardchange;
      this.players[playernchange].cards[cardnchange]=cardactionchange;
    }
    changeturn(client){
        if(this.turn<this.players.length-1 && this.turn!=this.playernmosca){
          this.turn+=1
          if(this.turn==this.playernmosca && this.mosca==true ){this.turn=-1;client.emit('checkwinnerstart',{interval:2500})};
        }else if(this.turn==this.playernmosca && this.mosca==true ){console.log("game finalize")}
        else{ 
          this.round+=1;
          this.turn=0;
          if(this.turn==this.playernmosca && this.mosca==true ){this.turn=-1;client.emit('checkwinnerstart',{interval:2500})}
        }
    }

  }