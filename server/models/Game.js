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

  }