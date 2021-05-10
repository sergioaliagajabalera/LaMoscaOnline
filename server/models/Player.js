
//model or class player
module.exports = class Player {


  //this constructor is for register player
  constructor(username, password,email,country) {
    this.username= username;
    this.password = password;
    this.email = email;
    this.country=country;
    //let data= new Date();
    //let data2=data.getDay()+'-'+data.getMonth()+'-'+data.getFullYear();
    //let hour=data.getHours()+':'+data.getMinutes();
    //let datetotal=data2+' '+hour;
    //this.d_register=datetotal;

  }

}

