const Discord = require("discord.js");
const fs = require("fs");

exports.run = (client, message, args) => {
    let users = JSON.parse(fs.readFileSync('./users.json'));
    let text = "";
    for(user of users)
    {
        text += `${user.id} : <@${user.discord}> ${user.team}\n`;    
    }

    message.channel.send(new Discord.MessageEmbed()
    .setTitle("List of linked people")
    .setDescription(text)
    .setColor("RANDOM")
    .setFooter("Algerian Maths Olympiad"));
};