const axios = require('axios')
const { DOMParser } = require('xmldom')
const Discord = require("discord.js");
const fs = require("fs");
const FormData = require('form-data');


exports.run = async (client, message, args) => {
    let response;
    response = await axios.get(client.config.amo_website+'/control/correction/' + args[0] + '?decide=a', { headers: { 'Cookie': `sessionid=${client.sessionid}; csrftoken=${client.csrftoken}` } });
    response = await axios.get(client.config.amo_website+'/control/correction/' + args[0] + '?decide=to_correct', { headers: { 'Cookie': `sessionid=${client.sessionid}; csrftoken=${client.csrftoken}` } });
    let document = new DOMParser().parseFromString(response.data, "text/xml");
    let token = document.getElementsByTagName("input")[1].getAttribute("value");


    let data = new FormData();
    data.append('csrfmiddlewaretoken', token);
    data.append('content', 'The problem has automatically been put in red by AlgerianMO Helper Bot');
    data.append('status', 'wrong');

    let configAxios = {
        method: 'post',
        maxBodyLength: Infinity,
        url: client.config.amo_website+'/control/correction/' + args[0] + '?decide=to_correct',
        headers: {
            'Cookie': `sessionid=${client.sessionid}; csrftoken=${client.csrftoken}`,
            'Referer': client.config.amo_website+'/control/correction/' + args[0] + '?decide=to_correct',
            ...data.getHeaders()
        },
        data: data
    };

    axios.request(configAxios)
        .then((response) => {
            message.channel.send("Done.");
        })
        .catch((error) => {
            console.log(error);
            message.channel.send("Error.");
        });

}