const Discord = require('discord.js');
module.exports = {
	name: 'join',
	description: 'Join the event!',
	args: true,
    usage: '<Name of Event>',
	execute(message, args, list) {
		if(message.member.roles.find(role => role.name === "EB-"+args[0])) {
			return message.reply("You already joined the event")
		}
		else{
			if(!message.guild.roles.find(role => role.name.toUpperCase() === "EB-"+ args[0].toUpperCase())){
				return message.reply("no event found");
			}
			else{
			    let role = message.guild.roles.find(role => role.name.toUpperCase() === "EB-"+args[0].toUpperCase());
				message.member.addRole(role).catch(console.error);
				return message.reply("you joined the " + "**"+args[0]+"**" + " event.");
			}
				
		}
		
		

	},
};