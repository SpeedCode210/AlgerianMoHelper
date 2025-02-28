const axios = require('axios')
const { DOMParser } = require('xmldom')
const Discord = require("discord.js");
const fs = require("fs");


exports.run = async (client, message, args) => {
    if (!message.member.roles.cache.find(r => r.id == client.config.botAdminRole))
        return message.channel.send("You are not allowed to use this command.");
    let user = 0;
    if (!message.mentions.roles.first()) {
        return message.channel.send("Mention the role concerned please.")
    }

    let roleMembers = message.mentions.roles.first().members;
    let channel = message.channel;
    roleMembers.forEach(member => {
        channel.createOverwrite(member.user, {
            VIEW_CHANNEL: true
        });

    });

    let msg = await message.channel.send(
        new Discord.MessageEmbed()
            .setTitle("Success")
            .setDescription("Operation done !")
            .setColor("GREEN")
            .setFooter("Algerian Math Olympiad")
    );


}