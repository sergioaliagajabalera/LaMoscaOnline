//model or class player
module.exports = class Skills {
    
    constructor(username,wins,losses,percent,xp) {
        this.username=username;
        this.wins=wins;
        this.losses=losses;
        this.percent=percent;
        this.xp=xp;
    }
  
    set name(value) {
        this._name = value
    }
    
    get name() {
        return this._name
    }

    calculatepercent(){
        this.percent=this.wins*100/(this.wins+this.losses);
    }
}