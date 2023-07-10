const axios = require('axios')
const { DOMParser } = require('xmldom')
const Discord = require("discord.js");

module.exports = async(client) => {
  console.log(`Je suis connecté et prêt à servir `+client.guilds.cache.size +" serveurs et "+client.users.cache.size+" utilisateurs");
  client.amo_login(client);
  setInterval(()=>client.amo_login(client), 120000);
}
