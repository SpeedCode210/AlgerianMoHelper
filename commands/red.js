const axios = require('axios')
const { DOMParser } = require('xmldom')
const Discord = require("discord.js");
const fs = require("fs");


exports.run = async (client, message, args) => {
    if(!message.member.roles.cache.find(r => r.id == client.config.botAdminRole))
        return message.channel.send("You are not allowed to use this command.");
    let user = 0;
    if(message.mentions.users.first()){
        let users = JSON.parse(fs.readFileSync('./users.json'));
        for(let u of users){
            if (u.discord == message.mentions.users.first().id)
                user = u.id;
        }
    }
    else{
        return message.channel.send("Mention the user to upgrade please.")
    }
    if(user==0){
        return message.channel.send("Please link the account of the user before.")
    }

    let msg = await message.channel.send(
        new Discord.MessageEmbed()
            .setTitle("Confirmation")
            .setDescription("Do you really want to make this user red ?")
            .setColor("RANDOM")
            .setFooter("Algerian Maths Olympiad")
    );

    msg.react("✅");
    msg.react("❌");
    let filter = (reaction, user) => (reaction.emoji.name === '✅' || reaction.emoji.name === '❌') && user.id === message.author.id;
    let collector = await msg.createReactionCollector(filter, { time: 100000 });
    collector.on('collect', async (r)=>{
        switch (r.emoji.name)
        {
            case "✅":
                try{
                    await message.mentions.members.first().roles.remove(client.config.trainingStartRole);
                }catch{}
                try{
                    await message.mentions.members.first().roles.remove(client.config.whiteRole);
                }catch{}
                try{
                    await message.mentions.members.first().roles.remove(client.config.greenRole);
                }catch{}
                try{
                    await message.mentions.members.first().roles.add(client.config.redRole);
                }catch{}
                msg.reactions.removeAll();
                collector.stop();
                msg.channel.send("Welcome to red !");
                let users = JSON.parse(fs.readFileSync('./users.json'));
                    for (let u of users) {
                        if (u.discord == message.mentions.users.first().id)
                            u.team = "red";
                    }
                    fs.writeFile('./users.json', JSON.stringify(users), err => {
                        if (err) {
                            console.log('Error writing file', err)
                        }
                    });
                break;
            case "❌":
                collector.stop();
                message.delete();
                msg.delete();
                break;
        }
        
    });


}