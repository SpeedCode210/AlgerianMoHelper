const axios = require('axios')
const { DOMParser } = require('xmldom')
const Discord = require("discord.js");
const fs = require("fs");
var unicodeit = require('unicodeit');
const textToImage = require('text-to-image');
const { registerFont } = require('canvas')

registerFont('fonts/NotoSans-Regular.ttf', { family: 'Noto Sans' });
registerFont('fonts/NotoSansMath-Regular.ttf', { family: 'Noto Sans Math' });
registerFont('fonts/NotoSansArabic-VariableFont_wdth,wght.ttf', { family: 'Noto Sans Arabic' });

exports.run = async (client, message, args) => {
    let response;
    try {
        if(!args[0].includes("/")){
            message.channel.send("The specified problem isn't valid, write it as a/185.");
            return;
        }
        response = await axios.get(client.config.amo_website+'/problems/' + args[0] + '/', { headers: { 'Cookie': `sessionid=${client.sessionid}; csrftoken=${client.csrftoken}` } });
    } catch {
        message.channel.send("The specified problem isn't valid, write it as a/185.");
        return;
    }
    let document = new DOMParser().parseFromString(response.data, "text/xml");

    textToImage.generateSync(unicodeit.replace(document.getElementsByClassName("my-4")[1].textContent.replaceAll("$$","\n").replaceAll("$","")),{
        debug: true,
        debugFilename: 'debug_file.png',
        verticalAlign: 'center',
        textAlign: 'right',
        bgColor: '#2e3035',
        textColor: '#fff',
        fontFamily: "Noto Sans Math, Noto Sans, Noto Sans Arabic"
        })

    message.channel.send({
        content: '__**Problem '+args[0]+'**__ \n ',
        files: [{
          attachment: 'debug_file.png',
          name: 'Problem.png'
        }]
      });

}