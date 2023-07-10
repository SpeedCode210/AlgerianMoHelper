const axios = require('axios')
const { DOMParser } = require('xmldom')
const Discord = require("discord.js");
const fs = require("fs");

exports.run = async (client, message, args) => {
    if (!message.member.roles.cache.find(r => r.id == client.config.botAdminRole))
        return message.channel.send("You are not allowed to use this command.");
    let user = 0;
    if (message.mentions.users.first()) {
        let users = JSON.parse(fs.readFileSync('./users.json'));
        for (let u of users) {
            if (u.discord == message.mentions.users.first().id)
                user = u.id;
        }
    }
    else {
        return message.channel.send("Mention the user to upgrade please.")
    }
    if (user == 0) {
        return message.channel.send("Please link the account of the user before.")
    }

    let response;
    try {
        response = await axios.get(client.config.amo_website+'/accounts/' + user + '/', { headers: { 'Cookie': `sessionid=${client.sessionid}; csrftoken=${client.csrftoken}` } });
    } catch {
        message.channel.send("The user doesn't exist.");
        return;
    }

    var document = new DOMParser().parseFromString(response.data, "text/xml");

    let b = 0;
    let problems = document.getElementsByTagName("a");
    for (let i = 0; i < problems.length; i++) {
        let match = problems[i].getAttribute("href").match(/(?<=\/problems\/)(b|a|nt|c|g)(?=\/[0-9]+)/g);
        if (match) {
            switch (match[0]) {
                case "b": b++; break;
            }
        }
    }

    let msg = await message.channel.send(
        new Discord.MessageEmbed()
            .setTitle(document.getElementsByTagName("tbody")[0].getElementsByTagName("td")[0].textContent)
            .setDescription("The user has solved " + b + " basics problems. " + (b >= 25 ? "Welcome to white !" : "He is not ready for white yet, do you want to upgrade him anyway ?"))
            .setColor("RANDOM")
            .setFooter("Algerian Maths Olympiad")
    );
    if (b >= 25) {
        try {
            message.mentions.members.first().roles.remove(client.config.trainingStartRole);
        } catch { }
        try {
            message.mentions.members.first().roles.add(client.config.whiteRole);
        } catch { }
        let users = require('../users.json');
        for (let u of users) {
            if (u.discord == message.mentions.users.first().id)
                u.team = "white";
        }
        fs.writeFile('./users.json', JSON.stringify(users), err => {
            if (err) {
                console.log('Error writing file', err)
            }
        });



    } else {
        msg.react("✅");
        msg.react("❌");
        let filter = (reaction, user) => (reaction.emoji.name === '✅' || reaction.emoji.name === '❌') && user.id === message.author.id;
        let collector = await msg.createReactionCollector(filter, { time: 100000 });
        collector.on('collect', async (r) => {
            switch (r.emoji.name) {
                case "✅":
                    try {
                        message.mentions.members.first().roles.remove(client.trainingStartRole);
                    } catch { }
                    try {
                        message.mentions.members.first().roles.add(client.config.whiteRole);
                    } catch { }
                    msg.reactions.removeAll();
                    collector.stop();
                    msg.channel.send("Welcome to white !");
                    let users = JSON.parse(fs.readFileSync('./users.json'));
                    for (let u of users) {
                        if (u.discord == message.mentions.users.first().id)
                            u.team = "white";
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
}