const Discord = require("discord.js");

exports.run = (client, message, args) => {
    if(args.length < 1){
      message.channel.send("Please specify the problem sumber !");
      return;
    }
    let pbNumber = args[0].match(/[0-9]+/i);
    if(pbNumber == null || pbNumber.length < 1)
    {
      message.channel.send("Please specify the problem sumber !");
      return;
    }

    pbNumber = args[0].match(/[0-9]+/i)[0];
    message.channel.send(new Discord.MessageEmbed()
    .setTitle("Algebra problem "+pbNumber)
    .setDescription("💡 Hint : || Use maths ||")
    .setColor("RANDOM")
    .setFooter("Algerian Maths Olympiad"));
};