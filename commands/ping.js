const Discord = require("discord.js");
exports.run = (client, message, args) => {
    message.delete();
    const embed = new Discord.MessageEmbed()
      .setTitle("Hi "+message.author.username)
      .setDescription("My ping is : "+client.ws.ping+"ms")
      .setColor("RANDOM")
      .setFooter("Algerian Maths Olympiad");
    message.channel.send(embed);
  
};
