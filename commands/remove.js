const Discord = require('discord.js');
module.exports = {
	name: 'remove',
    description: 'Removes a scheduled event',
    args: true,
    usage: '<Name of Event>',
	execute(message, args, result, connection) {
        if(result[0] == null){
            return message.channel.send("No event found");
        }
        for(i = 0; i < result.length; i++){
            if(args[0].toUpperCase() == result[i].Name.toUpperCase()){
                if (message.guild.member(result[i].Owner)) {
                    if(result[i].Owner == message.author.id){
                        let name = result[i].Name;
                        connection.query(`DELETE FROM \`${message.guild.id}\` WHERE Name = '${result[i].Name}' `, function (err, result, fields) {
                            if (err) message.reply(err);
                          });
                        if(message.guild.roles.find(role => role.name.toUpperCase() === "EB-"+args[0].toUpperCase())){
                            message.guild.roles.find(role => role.name.toUpperCase() === "EB-"+args[0].toUpperCase()).delete();
                        }      
                        return message.channel.send("**"+name+"**" + " event removed.");
                            
                    }
                    else{
                        return message.reply("You're not the owner of the event.")
                    }
                  
                  }
                  else{
                    let name = result[i].Name;
                    connection.query(`DELETE FROM \`${message.guild.id}\` WHERE Name = '${result[i].Name}' `, function (err, result, fields) {
                        if (err) message.reply(err);
                      });
                    if(message.guild.roles.find(role => role.name.toUpperCase() === "EB-"+args[0].toUpperCase())){
                        message.guild.roles.find(role => role.name.toUpperCase() === "EB-"+args[0].toUpperCase()).delete();
                    }   
                    return message.channel.send("**"+name+"**" + " event removed.");

                  }
               
            }
        }
        return message.channel.send("No event found");
        
     
	},
};