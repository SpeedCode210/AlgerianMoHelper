const axios = require('axios')
const { DOMParser } = require('xmldom')
const Discord = require("discord.js");
const fs = require("fs");

const teamWhiteProblems = [118, 119, 120, 121, 122, 123, 162, 163, 164, 166, 170, 171, 172, 173, 174, 175, 176, 177, 178, 179, 180,
    131, 132, 133, 134, 135, 136, 137, 138, 140, 182, 183, 184, 186, 187, 188, 189, 190, 193, 139, 141, 142,
    143, 144, 191, 192, 194, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26,
    87, 88, 89, 90, 101, 102, 103, 104, 105, 106, 107, 108, 195, 91, 92, 93, 94, 95, 96, 99, 100, 109, 110, 111,
    112, 113, 97, 98, 114, 115, 116, 117, 57, 58, 59, 60, 65, 66, 67, 73, 74, 75, 76, 61, 62, 63, 64, 68, 69, 77,
    78, 79, 80, 81, 82, 83, 85, 70, 71, 72, 84];

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

    let t = 0;
    let a = 0;
    let b = 0;
    let c = 0;
    let g = 0;
    let nt = 0;
    let t_w = 0;
    let a_w = 0;
    let c_w = 0;
    let g_w = 0;
    let nt_w = 0;
    let problems = document.getElementsByTagName("a");
    for (let i = 0; i < problems.length; i++) {
        let match = problems[i].getAttribute("href").match(/(?<=\/problems\/)(b|a|nt|c|g)(?=\/[0-9]+)/g);
        if (match) {
            switch (match[0]) {
                case "a": a++; break;
                case "b": b++; break;
                case "c": c++; break;
                case "g": g++; break;
                case "nt": nt++; break;
            }
            if (teamWhiteProblems.includes(parseInt(problems[i].textContent.match(/[0-9]+/g)[0]))) {
                switch (match[0]) {
                    case "a": a_w++; break;
                    case "c": c_w++; break;
                    case "g": g_w++; break;
                    case "nt": nt_w++; break;
                }
            }
        }


    }
    problems = document.getElementsByTagName("tr");
    for (let i = 0; i < problems.length; i++) {
        if (problems[i].textContent.match(/مسألة/g)) {
            t++;
            if (teamWhiteProblems.includes(parseInt(problems[i].textContent.match(/[0-9]+/g)[0]))) {
                t_w++;
            }
        }
    }

    let str1 = `
**احصائيات عامة**
الأساسيات : %${Math.floor(100 * b / 31)} - الجبر : %${Math.floor(100 * a / 73)} - التوفيقات : %${Math.floor(100 * c / 45)} \n الهندسة : %${Math.floor(100 * g / 41)} - نظريات الأعداد : %${Math.floor(100 * nt / 94)} - المجموع : ${t}
`;

    let str2 = `
**Team White Instructions**
الجبر : %${Math.floor(100 * a_w / 47)} - التوفيقات : %${Math.floor(100 * c_w / 32)} - الهندسة : %${Math.floor(100 * g_w / 22)} \n نظريات الأعداد : %${Math.floor(100 * nt_w / 29)} - المجموع : ${t_w}/${teamWhiteProblems.length}
`;


    let msg = await message.channel.send(
        new Discord.MessageEmbed()
            .setTitle(document.getElementsByTagName("tbody")[0].getElementsByTagName("td")[0].textContent)
            .setDescription(document.getElementsByTagName("tbody")[0].getElementsByTagName("td")[1].textContent + "\n**Points :** " + document.getElementsByTagName("tbody")[1].getElementsByTagName("td")[1].textContent + "\n**Rank :** " + document.getElementsByTagName("tbody")[1].getElementsByTagName("td")[3].textContent + '\n' + str1 + '\n' + str2 + "\n **Do you want to upgrade him to team green ?**")
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
                    message.mentions.members.first().roles.remove(client.config.trainingStartRole);
                }catch{}
                try{
                    message.mentions.members.first().roles.remove(client.config.whiteRole);
                }catch{}
                try{
                    message.mentions.members.first().roles.add(client.config.greenRole);
                }catch{}
                msg.reactions.removeAll();
                collector.stop();
                msg.channel.send("Welcome to green !");
                let users = JSON.parse(fs.readFileSync('./users.json'));
                    for (let u of users) {
                        if (u.discord == message.mentions.users.first().id)
                            u.team = "green";
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