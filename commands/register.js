const {SlashCommandBuilder} = require('discord.js');
const servers = require('..');

module.exports = {
    data: new SlashCommandBuilder()
    .setName('register')
    .setDescription('register to be in the system'),
    async execute(interaction) {

        let registered = servers.servers.get(interaction.guild.id).addMember(interaction.member);
        console.log(registered);
        if (registered) {
            await interaction.reply("You're registered!");
        } else {
            await interaction.reply("You're already registered")
        }
        
    
    }
}