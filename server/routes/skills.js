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