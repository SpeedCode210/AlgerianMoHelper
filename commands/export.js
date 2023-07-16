const axios = require('axios')
const { DOMParser } = require('xmldom')
const Discord = require("discord.js");
const fs = require("fs");

exports.run = async (client, message, args) => {
    message.channel.send({
        content: 'Here is the collected data :\n ',
        files: [{
          attachment: 'users.json',
          name: 'users.json'
        }]
      });
}