const { prefix } = require('../config.json');
module.exports = {
    name: 'commands',
    aliases: ['help'],
    description: 'List all of my commands or info about a specific command.',
	usage: '[command name]',
	execute(message, args) {
		const data = [];
        const { commands } = message.client;
        if (!args.length) {
            data.push('Command List:');
            data.push(commands.map(command => command.name).join('\n'));
            return message.channel.send(data, { split: true }), message.channel.send("\n OR \n!commands <command name>"); //split, splits the message into 2 incase it exceeds 2000 character limit
        }
        const name = args[0].toLowerCase();
        const command = commands.get(name) || commands.find(c => c.aliases && c.aliases.includes(name));
        if (!command) {
            return message.reply('that\'s not a valid command!');   
        }
        if (command.description) data.push(`**Description:** ${command.description}`);
        if (command.usage) data.push(`**Usage:** \`${prefix}${command.name} ${command.usage}\``);
        message.channel.send(data, { split: true });

	},
};

