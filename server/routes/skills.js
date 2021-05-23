var express = require('express');
var router = express.Router();
var Skills = require('../models/Skills');

exports.skills=[]


//this is for update skill, gamefinished
exports.gamefinished=function(db,skills,username,xp,action) {
    var skill=[];
    skill=skills.find(a=>a.username==username);
    console.log(skill);
    if(action=="loss") skill.losses+=1;
    else{
        skill.wins+=1;
        skill.xp+=xp;
    } 
    skill.calculatepercent();
    var sql = "update Skills set wins=?, losses=?, percent=?, xp=? where username=?";
    db.query(
        sql, [skill.wins,skill.losses,skill.percent,skill.xp,username], 
        function(err, result, fields){
        if(err){ 
            console.log(err);
        }else{
            console.log("Update skill successful");        
        }
    });
 };

 exports.showskillsandprofile=function(players,skills) {
    return function(req, res) {
        try {
            console.log(req.query.username);
            var username=req.query.username;
            var player=[];
            player=players.find(a=>a.username==username);
            
            if(player!=undefined) {
                var skill=skills.find(a=>a.username==username);
                var form={player:player,skills: skill};
                res.send({ status: 1, data:form})
            }else res.send({ status: 2, data:'User not exist'}); 
        } catch (error) {
            res.send({ status: 0, error: error });
        } 
    }
 }