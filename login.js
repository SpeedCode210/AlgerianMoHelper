const axios = require('axios')
const { DOMParser } = require('xmldom')
const Discord = require("discord.js");
const fs = require("fs");
const FormData = require('form-data');


exports.run = async (client) => {
    let response;
    response = await axios.get(client.config.amo_website+'/accounts/login/', {withCredentials: true});
    let csrftoken = response.headers['set-cookie'][0].match(/(?<=csrftoken=).*?(?=;)/gm)[0];
    let document = new DOMParser().parseFromString(response.data, "text/xml");
    let token = document.getElementsByTagName("input")[0].getAttribute("value");


    let data = new FormData();
    data.append('csrfmiddlewaretoken', token);
    data.append('username', client.config.username);
    data.append('password', client.config.password);

    let configAxios = {
        method: 'post',
        maxBodyLength: Infinity,
        withCredentials: true,
        maxRedirects: 0,
        url: client.config.amo_website+'/accounts/login/',
        headers: {
            'Cookie': `csrftoken=${csrftoken}`,
            'Referer': client.config.amo_website+'/accounts/login/',
            ...data.getHeaders()
        },
        data: data
    };

    axios.request(configAxios)
        .then((response) => {
            console.log("Error During Login.");
        })
        .catch((error) => {
            console.log("Login Done.");
            client.csrftoken = error.response.headers['set-cookie'][0].match(/(?<=csrftoken=).*?(?=;)/gm)[0];
            client.sessionid = error.response.headers['set-cookie'][1].match(/(?<=sessionid=).*?(?=;)/gm)[0];
        });

}