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
      this.cards=cardsgenerics;
      this.rounds=0;
      this.turn=0;
      //board
      this.cardlast=null;
      this.cardsecondlast=null;
    }
  
    set name(value) {
        this._name = value
    }
    
    get name() {
        return this._name
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
      var card=this.cards.shift();
      return card;
    }
    dropCard(player,cardn,card/*optional*/){
      console.log(this.cards.length);
      const cardtemp=this.cardlast;
      this.cardsecondlast=cardtemp;
      console.log(card);
      if(card==undefined){
        const cardtemp2=this.players[player].cards[cardn];
        this.cardlast=cardtemp2;
        this.players[player].cards.splice(cardn,1);
      }else this.cardlast=card;

      if(this.rounds!=0) {
        console.log("hollaaaaaaaaaaaa");
        this.cards.push(this.cardsecondlast);
        const shuffledArray = this.cards.sort((a, b) => 0.5 - Math.random()); //shuffled cards depend on if number random generated is negative or positive
        this.cards=shuffledArray;
      };
      console.log(this.cards.length);
      this.rounds+=1;
    }
    collectCard(player,card){
      this.players[player].cards.push(card);
    }

    changeandthrowcollectCard(playern,cardnchange,card){
        const cardchange=this.players[playern].cards[cardnchange];
        this.players[playern].cards[cardnchange]=card;
        this.dropCard(playern,card,cardchange);
    }

    changeturn(){
        this.turn+=1;
    }

  }