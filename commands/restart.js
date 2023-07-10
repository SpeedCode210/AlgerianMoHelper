const axios = require('axios')
const { DOMParser } = require('xmldom')
const Discord = require("discord.js");
const fs = require("fs");


exports.run = async (client, message, args) => {
    if(!message.member.roles.cache.find(r => r.id == client.config.botAdminRole))
        return await message.channel.send("You are not allowed to use this command.");
    process.exit();
}