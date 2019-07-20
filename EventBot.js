const fs = require('fs')
const Discord = require('discord.js');
const {prefix,token} = require('./config.json');
const util = require('util');

var moment = require('moment');
var special = ['\'',',','`','!','"','#','$','%','&','(',')','*','+','-','.','/',':',';','<','=','>','?','@','[',']','^','_','\\','{','|','}','~']
const EventBot = new Discord.Client();
EventBot.commands = new Discord.Collection();

const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

var mysql = require('mysql');
var connection = mysql.createConnection({
  debug: ['ComQueryPacket', 'RowDataPacket'],
  host     : 'localhost',
  user     : 'root',
  password : 'Durann31!',
  database : 'events'
});

connection.on( "error", (error) => {
	console.log( "mysql Error encountered: " + error );
});
EventBot.on( "error", (error) => {
	console.log( "Error encountered: " + error );
});
connection.connect(function(err){
    if (err) {
        console.error('error: ' + err.message);
        setTimeout(() => {
            connection.connect(function(err){
                if(err){
                    console.error('error: ' + err.message);
                }
            });
          }, 120000);
        
    }
});
   


for (const file of commandFiles) {
	const command = require(`./commands/${file}`);
	// set a new item in the Collection
	// with the key as the command name and the value as the exported module
	EventBot.commands.set(command.name, command);
}


EventBot.on('ready', () => {
    console.log('I am ready!');
    for(i =0; i < EventBot.guilds.array().length; i++){ 
        let servername = EventBot.guilds.array().map(guild => guild.id)[i];   
        connection.query(`SELECT * FROM \`${EventBot.guilds.array().map(guild => guild.id)[i]}\``, function (err, result, fields) {
            if(result == null || result == undefined){
                return;
            }
            if (err) console.log(err);
            for(j = 0; j < result.length; j++){

                let eventname = result[j].Name
                let roledis = EventBot.guilds.get(servername).roles.find(role => role.name.toUpperCase() === "EB-"+result[j].Name.toUpperCase());
                let CID = result[j].ChannelID;

                let sdate = moment(result[j].Date + result[j].Time, "MMDDYYYYHHmm");

                if(CID == undefined || CID == null){
                    CID = EventBot.guilds.array().map(guild => guild)[0].channels.map(channel => channel.id)[0]
                }
                
                if(result[j].Notify.toUpperCase() == "T"){
                  
                  
                  //if event passed and will notify               
                  if(sdate - moment().subtract(4,'h') < 0){
                        setTimeout(() => {                   
                                EventBot.channels.get(CID).send("Bot Server Restarted: "  + roledis +" event started "+  moment(sdate - moment().subtract(4,'h')).fromNow() +"! Deleting event details in 1 minute!")
                                setTimeout(() => {
                                        connection.query(`DELETE FROM \`${servername}\` WHERE \`Name\` = \'${eventname}\' `, function (err, result, fields) {
                                            if (err) console.log(err);
                                        });
                                        if(roledis){
                                            roledis.delete()
                                            EventBot.channels.get(CID).send(eventname + " has been deleted.")
                                        }                                 
                                        }, 60000);             
                        }, sdate - moment().subtract(4, 'h'));
                        
    
                  }
                  //If event didnt pass and will notify
                  else{
                        setTimeout(() => {
                                
                            EventBot.channels.get(CID).send(roledis + " event is starting now! Deleting event details in 1 minute!")
                                setTimeout(() => {
                                        connection.query(`DELETE FROM \`${servername}\` WHERE Name = \'${eventname}\' `, function (err, result, fields) {
                                        if (err) console.log(err);
                                        });
                                        if(roledis){
                                            roledis.delete()
                                        }  
                                        EventBot.channels.get(CID).send(eventname + " has been deleted.")
                                        }, 60000);             
                        }, sdate - moment().subtract(4, 'h'));
                  }
                       
                }
                else{
                    //IF event already passed and no notify
                    if(sdate - moment().subtract(4,'h') < 0){
                        setTimeout(() => {
                            connection.query(`DELETE FROM \`${servername}\` WHERE Name = \'${eventname}\' `, function (err, result, fields) {
                                if (err) console.log(err);
                             });
                            if(roledis){
                                 roledis.delete();
                            }  
                          }, 1000);
                    }
                    //IF event didnt passed and no notify
                    else{
                        setTimeout(() => {                      
                            EventBot.channels.get(CID).send(eventname + " event is starting now! Deleting event details in 1 minute!")
                                setTimeout(() => {
                                        connection.query(`DELETE FROM \`${servername}\` WHERE Name = \'${eventname}\' `, function (err, result, fields) {
                                        if (err) console.log(err);
                                        });
                                        if(roledis){
                                            roledis.delete()
                                        }  
                                        EventBot.channels.get(CID).send(eventname + " has been deleted.")
                                        }, 60000);             
                        }, sdate - moment().subtract(4, 'h'));
                            
                    }
                }
        
        }
          });
    
    } 
    
});



EventBot.on("guildCreate", guild => {
    
    let createEvents = `CREATE TABLE IF NOT EXISTS \`${guild.id}\` ( Name varchar(255), Date varchar(255), Time varchar(255), Notify varchar(10), Description varchar(255), Owner BIGINT, Timestamp BIGINT, ChannelID varchar(255));`;
    connection.query(createEvents, function(err, results, fields) {
        if(err) console.log(err.message);
        
    });

});

EventBot.on("guildDelete", guild => {
    let removeEvents = `DROP TABLES \`${guild.id}\``;
    connection.query(removeEvents, function(err, results, fields) {
        if(err) {
            console.log(err.message);
        }
    });
   
})


// Create an event listener for messages
EventBot.on('message',message => {
    if(!message.content.startsWith(prefix) || message.author.bot) return;
    let args = message.content.slice(prefix.length).split(/ +/);
    const commandName = args.shift().toLowerCase();

    //Wrong args
    const command = EventBot.commands.get(commandName) || EventBot.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));
    if (!command) return;
    if(command.args && !args.length){
        let reply = `You didn't provide any arguments, ${message.author}!`
        if(command.usage){
            reply += `\n**Usage**: \`${prefix}${command.name} ${command.usage}\``;
        }
        return message.channel.send(reply);
    }


    try{  
        for(i = 0; i < special.length;i++){
            if(message.content.substring(3,message.content.length).includes(special[i])){
                return message.reply("Can't use special characters. (Currently working on a fix!)")
            }
        }    
        connection.query(`SELECT * FROM \`${message.guild.id}\``, function (err, result, fields) {
            if(err){
              if(err.code == 'ER_NO_SUCH_TABLE'){
                let createEvents = `CREATE TABLE IF NOT EXISTS \`${message.guild.id}\` ( Name varchar(255), Date varchar(255), Time varchar(255), Notify varchar(10), Description varchar(255), Owner BIGINT, Timestamp BIGINT, ChannelID varchar(255));`;
                connection.query(createEvents, function(err, results, fields) {
                    if(err) console.log(err.code);});
                }
                else console.log(err);
            }
            command.execute(message, args,result,connection);
          });
        
    }catch(error){
        console.error(error);
        message.reply('There was an error');
    } 

});




EventBot.login(token);