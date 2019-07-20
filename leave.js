const Discord = require('discord.js');
module.exports = {
	name: 'leave',
	description: 'Leaves the event!',
	args: true,
    usage: '<Name of Event>',
	execute(message, args, list) {
		if(!message.member.roles.find(role => role.name.toUpperCase()=== "EB-"+args[0].toUpperCase())) {
			return message.reply("you are not part of that event or the event was not found")
		}
		else{
			if(message.guild.roles.find(role => role.name.toUpperCase() === "EB-"+args[0].toUpperCase())){
				let role = message.guild.roles.find(role => role.name.toUpperCase() === "EB-"+args[0].toUpperCase());
				message.member.removeRole(role).catch(console.error);
				return message.reply("removed " + "**"+args[0]+"**" );
			}
			else{
				return message.reply("no role found");
					
			}
				
		}
		
		
	},
};