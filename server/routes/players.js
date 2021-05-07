
var express = require('express');
var router = express.Router();
var Player = require('../models/Player');

exports.players=[]




exports.login=function() {
  return function(req, res) {
    console.log(req.body)
    res.send({ status: 1, data: "holaa" });
    /*
    console.log(req.body);
    try {
      let { username, password} = req.body; //it get the values pass for request
      const hashed_password = md5(contrasena.toString()); //it return hash of the password
      console.log(username,password);
      const sql = `SELECT * FROM Players WHERE username = ? AND pasword = ?` //We create a query for verification the name of user and hash password 
      console.log(username+hashed_password);
      db.query(
        sql, [username, hashed_password], 
        function(err, result, fields){
          if(err){ 
            res.send({ status: 0, data: err });
          }else{
            
            res.send({ status: 1, data: result});
          }
      });
    } catch (error) {
        res.send({ status: 0, error: error });
    }
    */
  }
};


/*
exports.register=function(db,players) {
  return function(req, res) {
    try {
      console.log(req.body);
      let { username, password} = req.body; //recogemos los valores pasados por la peticion
      const hashed_password = md5(contrasena.toString()); //nos devuelve un hash de la contraseña
      const sql = `SELECT * FROM usuario WHERE usuario = ? AND contrasena = ?` //creamos una consulta para verificar el nombre de usuario y el hash de la contraseña
      console.log(usuario+contrasena+ip);
      con.query(
      sql, [usuario, hashed_password], 
      function(err, result, fields){
          if(err){ //err==true nos devuelve un error, en caso contrario nos devuelve los datos + el jsonwebtokens
              res.send({ status: 0, data: err });
          }else{
              const sql = `Insert Into UsersAccesLogs (usuario, description ,ip) VALUES ( ?, ?, ?)` //es realitza un log, on s'envia, usuario, descripcion (resultado anterior consulta),ip 
              console.log(sql);
              con.query(
                  sql, [usuario, "hola", ip], 
                  function(err, result, fields){
                      if(err){ //err==true nos devuelve un error, en caso contrario nos devuelve los datos + el jsonwebtokens
                          console.log(err);
                      }else{ 
                          let token = jwt.sign({ data: result }, 'secret'); //genera un jsonwebtoken con los resultados obtenidos
                          res.send({ status: 1, data: result, token: token });
                      }
               });
          }
      })
  } catch (error) {
      res.send({ status: 0, error: error });
  }
    
  };
};
*/
