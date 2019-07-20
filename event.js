const Discord = require('discord.js');
var moment = require('moment');
const attachment = new Discord.Attachment('./EventBot.png', 'EventBot.png');
module.exports = {
	name: 'event',
	description: 'Details on an event',
	args: true,
    usage: '<Name of Event>',
	execute(message, args, result) {
		if(result.length == 0){
			return message.channel.send("No event called " + args[0]);
		}
		for(i = 0; i < result.length; i++){
            if(result[i].Name.toUpperCase() == args[0].toUpperCase()){
				let dateF = moment(result[i].Date, "MMDDYYYY").format("LL") 
				let timeF = moment(result[i].Time,"HHmm").format("LT")
				let desc = result[i].Description
				let timeset = moment(result[i].Timestamp).subtract(4, 'h').format("ddd MMMM DD YYYY hh:mm")
				let members = message.guild.roles.find(role => role.name.toUpperCase() === "EB-"+args[0].toUpperCase()).members.map(m=>m.user.tag).join('\n')
				let notify;
				if(result[i].Notify.toUpperCase() == "T"){
					notify = "True"
				}
				else if(result[i].Notify.toUpperCase() == "F"){
					notify = "False"				
				}
				let Embed = new Discord.RichEmbed()
					.attachFiles(['./EventBot.png'])
					.setAuthor(result[i].Name,'attachment://EventBot.png')			    
					.setDescription(
						 "\**Date:\** "+dateF + "\n" 
						+"\**Time:\** " +timeF +" EST" +"\n"
						+"\**Notify:\** " + notify + "\n" 
						+"\**Details:\** " + desc + "\n"
						+"\n \**Members:\** \n"+ members
						)
					.setFooter("Event created on " + timeset + " EST")
					.setColor("#38f755")
				return message.channel.send(Embed);
				
			}			
		}
		return message.channel.send("No event called " + args[0]);
	},
};