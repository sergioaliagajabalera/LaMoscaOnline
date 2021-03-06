
var express = require('express');
var router = express.Router();
var Player = require('../models/Player');
const Skills = require('../models/Skills');

exports.players=[]




exports.login=function(db,md5,players,skills) {
  return function(req, res) {
    console.log(req.body)
    try {
      console.log(players);
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
              if(!players.find(a=>a.username==username)){
                console.log(result[0].username);
                let player=new Player(result[0].username,result[0].pasword,result[0].email,result[0].country);
                players.push(player);
                const sql = `SELECT * FROM Skills WHERE username = ?`
                db.query(
                  sql, [username], 
                  function(err, result2, fields){
                    if(err){ 
                      res.send({ status: 0, data: err });
                    }else{
                      console.log(result2.length);
                      if(result2.length==0)res.send({ status: 3, data: 'error' });
                      else{
                        console.log(result2[0].username);
                        let skill=new Skills(result2[0].username,result2[0].wins,result2[0].losses,result2[0].percent,result2[0].xp);
                        skills.push(skill);
                        
                        res.send({ status: 1, data: result})
                      };
                    }
                });
              }else  res.send({ status: 1, data: result});
            }
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
      let { username, password,email,country,role} = req.body; //it get the values pass for request
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
                  sql, [username,hashed_password,email,country,null,role], 
                  function(err, result, fields){
                    if(err){ 
                      console.log(err);
                    }else{ 
                      var sql = "Insert Into Skills(username, wins,losses,percent,xp) VALUES (?,0,0,0,0)";
                      db.query(
                        sql, [username], 
                        function(err, result, fields){
                          if(err){ 
                            console.log(err);
                          }else{ 
                            res.send({ status: 1, data: result });
                          }
                        });
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
exports.logout=function(players,skills) {
  return function(req, res) {
    try {
      let { username} = req.body;
      var playertemp=players.find(a=> a.username==username)
      var skilltemp=skills.find(a=> a.username==username)
      console.log(skills);
      if(playertemp){
        var indexplayer=players.indexOf(playertemp);
        var indexskill=skills.indexOf(skilltemp);
        skills.splice(indexskill,1);
        players.splice(indexplayer,1);
        console.log(skills);
        res.send({ status: 1, data: 'User '+playertemp+' logout succesfull'  });
      }
    } catch (error) {
    }
  } 
};

//this is for get data user
exports.getdatauser=function(players,skills) {
  return function(req, res) {
    try {
      let username = req.query.username;
      var playertemp=players.find(a=> a.username==username)
      if(playertemp!=undefined){
        res.send({ status: 1, data: playertemp  });
      }else res.send({ status: 3, data: 'user not exist'});
    } catch (error) {
    }
  } 
};

//this is for get data user without login
exports.getdatauserwithoutlogin=function(db) {
  return function(req, res) {
    try {
      let username = req.query.username; //it get the values pass for request
      const sql = `SELECT * FROM Players WHERE username=?` //We create a query for verification the name of user and hash password 
      console.log(username);
      db.query(
        sql, [username], 
        function(err, result, fields){
          if(err){ 
            res.send({ status: 0, data: err });
          }else{
            console.log(result.length);
            if(result.length==0)res.send({ status: 3, data: 'User not exist' });
            else{
              res.send({ status: 1, data: result})
            }  
          }    
      });
    } catch (error) {
      console.log(error);
    }
  } 
};


//this is for edit user
exports.editUser=function(db) {
  return function(req, res) {
    try {
      let { username,email,country,role} = req.body; //it get the values pass for request
      console.log(username,email,country);
      if(role!=undefined){ 
        const sql = `update Players set email=?, country=?, rol=? where username=?`;
        db.query(
          sql, [email,country,role,username], 
          function(err, result, fields){
            if(err){ 
              res.send({ status: 3, data: ' email is exist'});
            }else{
                res.send({ status: 1, data: result });    
              }
            }
        )
      }
      else{
        const sql = `update Players set email=?, country=? where username=?`;
        db.query(
          sql, [email,country,username], 
          function(err, result, fields){
            if(err){ 
              res.send({ status: 3, data: ' email is exist'});
            }else{
                res.send({ status: 1, data: result });    
              }
            }
        )
      }  
    } catch (error) {
        console.log(error);
        res.send({ status: 0, error: 'error' });
    }
  };
};

//this is for change password user
exports.changepasswordUser=function(db,md5) {
  return function(req, res) {
    try {
      let { username,password} = req.body; //it get the values pass for request
      console.log(username);
      const hashed_password = md5(password.toString()); //it return hash of the password
      const sql = `update Players set pasword=? where username=?` 
      db.query(
        sql, [hashed_password,username], 
        function(err, result, fields){
          if(err){ 
            res.send({ status: 3, data: 'error'});
          }else{
              res.send({ status: 1, data: result });    
            }
          }
      )
    } catch (error) {
        console.log(error);
        res.send({ status: 0, error: 'error' });
    }
  };
};

//this is for delete user
exports.deleteUser=function(db) {
  return function(req, res) {
    try {
      let { username} = req.body; //it get the values pass for request
      console.log(username);
      const sql = `delete from Players  where username=?` 
      db.query(
        sql, [username], 
        function(err, result, fields){
          if(err){ 
            res.send({ status: 3, data: 'error'});
          }else{
              res.send({ status: 1, data: result });    
            }
          }
      )
    } catch (error) {
        console.log(error);
        res.send({ status: 0, error: 'error' });
    }
  };
};

 //function to compare arrays for players
 exports.comparer=function(otherArray){
  return function(current){
    return otherArray.filter(function(other){
      return other.player == current.player
    }).length == 0;
  }
}