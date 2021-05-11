//model or class player
module.exports = class Skills {


    //this constructor is for register player
    constructor(roomcode,map,size_g) {
      this.roomcode= roomcode;
      this.map = map;
      this.size_g = size_g;
      this.winner=null;
    }
  
    set name(value) {
        this._name = value
    }
    
    get name() {
        return this._name
    }
}