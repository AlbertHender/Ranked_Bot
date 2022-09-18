const {SlashCommandBuilder, EmbedBuilder, Message, ReactionCollector} = require('discord.js');
const servers = require('..');

module.exports = {
    data : new SlashCommandBuilder()
    .setName('endgame')
    .setDescription('End your match (The user that started it must be the one to end it)')
    .addNumberOption(option =>
		option.setName('input')
			.setDescription('The winner of the match (1 for team1 and 0 for team2)')
			.setRequired(true)),
    async execute(interaction) {
        let lobby = servers.servers.get(interaction.guildId);
        let ended = lobby.EndMatch(interaction.options.getNumber('input'),interaction.user.id);
        if (!ended){
            await interaction.reply('This game does not exist');
        } else {
            if (interaction.options.getNumber('input') === 1) {
                await interaction.reply('Team 1 is the winner! Your rating have been updated');
            } else {
                await interaction.reply('Team 2 is the winner! Your rating have been updated');
            }
        }
    }
}