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

    let response;
    try {
        response = await axios.get(client.config.amo_website+'/accounts/' + user + '/', { headers: { 'Cookie': `sessionid=${client.sessionid}; csrftoken=${client.csrftoken}` } });
    } catch {
        message.channel.send("The user doesn't exist.");
        return;
    }
    
    var document = new DOMParser().parseFromString(response.data, "text/xml");

    message.mentions.members.first().setNickname(document.getElementsByTagName("tbody")[0].getElementsByTagName("td")[0].textContent);

    message.channel.send("Done !");
}