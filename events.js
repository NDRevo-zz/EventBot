const Discord = require('discord.js');
var moment = require('moment');
var ArrayList = require('arraylist');
var moment = require('moment-timezone');
module.exports = {
        name: 'events',
        description: 'Shows all the events scheduled.',
	execute(message, args, result) {
        if(result == undefined){
                return message.channel.send('No Scheduled Events');
        }
        else if(result[0] == undefined){
                return message.channel.send('No Scheduled Events');
        }

        else{
                let list2 = new ArrayList;
                for(i = 0; i < result.length; i++){
                        if(message.guild.roles.find(role => role.name === "EB-"+ result[i].Name) == null){
                                amount = 0
                        }
                        else amount = message.guild.roles.find(role => role.name === "EB-"+ result[i].Name).members.map(m=>m.user.tag).length
                        list2.add(
                                `**${result[i].Name}**` + '\n' 
                                + moment(result[i].Date, "MMDDYYYY").format("LL") +' '+ moment(result[i].Time,"HHmm").format("LT") +" EST"+'\n' 
                                + "Details: "+ result[i].Description + "\n" 
                                + "Members: " + amount + "\n");
                
                }
        
                let Embed = new Discord.RichEmbed()
                        .addField("\__**Events\**__",list2,false)
                        .setColor("#4286f4")
                return message.channel.send(Embed);

        }
		
	},
};