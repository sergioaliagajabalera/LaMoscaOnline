
var express = require('express');
var router = express.Router();
var Player = require('../models/Player');

exports.players=[]




exports.login=function(db,md5,players) {
  return function(req, res) {
    console.log(req.body)
    try {
      let { username, password} = req.body; //it get the values pass for request
      const hashed_password = md5(password.toString()); //it return hash of the password
      console.log(username,password);
      const sql = `SELECT * FROM Players WHERE username = ? AND pasword = ?` //We create a query for verification the name of user and hash password 
      console.log(username+hashed_password);
      db.query(
        sql, [username, hashed_password], 
        function(err, result, fields){
          if(err){ 
            res.send({ status: 0, data: err });
          }else{
            console.log(result.length);
            if(result.length==0)res.send({ status: 3, data: 'User or password incorrect' });
            else{
              console.log(result[0].username);
              let player=new Player(result[0].username,result[0].pasword,result[0].email,result[0].country);
              players.push(player);
              res.send({ status: 1, data: result})
            };
          }
      });
    } catch (error) {
        res.send({ status: 0, error: error });
    }
  }
};


//this is for register user
exports.register=function(db,md5,players) {
  return function(req, res) {
    try {
      console.log("hollaa");
      let { username, password,email,country} = req.body; //it get the values pass for request
      console.log(username+password+email+country);
      const hashed_password = md5(password.toString()); //it return hash of the password
      console.log(username);
      const sql = `SELECT * FROM Players WHERE username = ? OR email=?` //We create a query for verification the name of user and hash email 
      console.log(username+email);
      db.query(
        sql, [username, email], 
        function(err, result, fields){
          if(err){ 
            res.send({ status: 0, data: err });
          }else{
              if(result.length==1)res.send({ status: 3, data: 'User or email is exist' });
              else{
                const sql = `Insert Into Players (username, pasword,email,country,f_register,rol) VALUES ( ?, ?, ?,?,?,?)` //create new player
                console.log(sql);
                db.query(
                    sql, [username,hashed_password,email,country,null,'user'], 
                    function(err, result, fields){
                        if(err){ 
                            console.log(err);
                        }else{ 
                            res.send({ status: 1, data: result });
                        }
                });
              }
          }
      })
  } catch (error) {
      res.send({ status: 0, error: error });
  }
    
  };
};

//this is for logout user
exports.logout=function(players) {
  return function(req, res) {
    try {
      let { username} = req.body;
      var playertemp=players.find(a=> a.username==username)
      console.log(players);
      if(playertemp)
      var indexplayer=players.indexOf(playertemp);
      console.log(indexplayer);
      players.splice(indexplayer,indexplayer+1);
      console.log(players);
        res.send({ status: 1, data: 'User '+playertemp+' logout succesfull'  });

    } catch (error) {
      res.send({ status: 0, error: error });
    }
  } 
};
