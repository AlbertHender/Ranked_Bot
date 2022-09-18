const {SlashCommandBuilder} = require('discord.js');
const servers = require('..');

module.exports = {
    data : new SlashCommandBuilder()
    .setName('getrating')
    .setDescription('See your rating in this server'),
    async execute(interaction){
        if (servers.servers.get(interaction.guildId).checkIfMember(interaction.user)) {
            await interaction.reply(servers.servers.get(interaction.guildId).getRank(interaction.user.id));
        } else {
            await interaction.reply("You are not a registered player in this server. Please register to get a rank");
        }
    }
}