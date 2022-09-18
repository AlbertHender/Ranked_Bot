const {SlashCommandBuilder, discordSort, EmbedBuilder} = require('discord.js');
const servers = require('..');

module.exports = {
    data: new SlashCommandBuilder()
    .setName('players')
    .setDescription('shows all registered players'),
    async execute(interaction) {
        let players = servers.servers.get(interaction.guild.id).getMembers();
        players = Array.from(players.values()).map(x=>x.getName());
        let embed = new EmbedBuilder();
        embed.setTitle('Players');
        embed.setDescription(players.join('\n'));
        await interaction.channel.send({embeds: [embed]});
        console.log(players)
    }
}

