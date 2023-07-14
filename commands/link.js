const axios = require('axios')
const { DOMParser } = require('xmldom')
const Discord = require("discord.js");
const fs = require("fs");

exports.run = async (client, message, args) => {
    if(!message.member.roles.cache.find(r => r.id == client.config.botAdminRole))
        return message.channel.send("You are not allowed to use this command.");
    if(!args[0] || !args[1] || !message.mentions.users.first()){
        message.channel.send("Invalid args");
        return;
    }

    fs.readFile("./users.json", "utf8", (err, jsonString) => {
        if (err) {
          console.log("File read failed:", err);
          return;
        }
        let users = JSON.parse(jsonString);
        let exists = false;
        for(usr of users){
            if(usr.discord.toString()==message.mentions.users.first().id.toString()){
                usr.id = args[1];
                exists = true;
            }
        }
        if(!exists)
            users.push({discord: message.mentions.users.first().id, id: args[1], team: "training-start"});
        jsonString = JSON.stringify(users);
        fs.writeFile('./users.json', jsonString, async (err) => {
            if (err) {
                console.log('Error writing file', err)
            } else {
                message.channel.send("Linking done !");
                try{
                    await message.mentions.members.first().roles.add(client.config.linkedRole);
                }catch{}
            }
        });
        
      });


}