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

  }