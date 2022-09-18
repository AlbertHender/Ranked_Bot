const { Client, GatewayIntentBits, Guild, Collection } = require('discord.js');
const { ClientID , token } = require('./config.json');
const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessageReactions , GatewayIntentBits.GuildMessages]});
const fs = require('node:fs');
const path = require('node:path');
const { REST } = require('@discordjs/rest');
const {Routes} = require('discord.js');
const server = require('./server');

let servers = new Map();
module.exports = {servers}

client.login(token);

client.once('ready', () => {console.log('Ready!');
});

//adds guild to list of servers
client.on('ready' , (guild) => {
	for (const value of client.guilds.cache.values()){
		console.log(value.id);
		newServer = new server(value.id,value.name);
		servers.set(value.id,newServer);
		console.log('Joined a server');
	  };

})

//Registers the slash commands
client.commands = new Collection();

const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
for (const file of commandFiles) {
	const filePath = path.join(commandsPath, file);
	const command = require(filePath);
	client.commands.set(command.data.name, command);
}

const commands = [];
const commandsP = path.join(__dirname, 'commands');
const commandF = fs.readdirSync(commandsP).filter(file => file.endsWith('.js'));
for (const file of commandF) {
	const filePath = path.join(commandsPath, file);
	const command = require(filePath);
	commands.push(command.data.toJSON());
}

const rest = new REST({ version: '10' }).setToken(token);
rest.put(Routes.applicationCommands(ClientID), { body: commands })
	.then(data => console.log(`Successfully registered ${data.length} application commands.`))
	.catch(console.error);


//dynamic command interaction
client.on('interactionCreate', async interaction => {
	if (!interaction.isChatInputCommand()) return;

	const command = interaction.client.commands.get(interaction.commandName);

	if (!command) return;

	try {
		await command.execute(interaction);
	} catch (error) {
		console.error(error);
		await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
	}
});
