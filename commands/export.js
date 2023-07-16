const axios = require('axios')
const { DOMParser } = require('xmldom')
const Discord = require("discord.js");
const fs = require("fs");

exports.run = async (client, message, args) => {
    if(!message.member.roles.cache.find(r => r.id == client.config.botAdminRole))
        return message.channel.send("You are not allowed to use this command.");
    message.channel.send({
        content: 'Here is the collected data :\n ',
        files: [{
          attachment: 'users.json',
          name: 'users.json'
        }]
      });
}