const {SlashCommandBuilder, EmbedBuilder} = require('discord.js');
const servers = require('..');

module.exports = {
    data: new SlashCommandBuilder()
    .setName('leaders')
    .setDescription('displays the rankings for the server'),
    async execute(interaction) {
        let players = servers.servers.get(interaction.guild.id).getMembers();
        let playersRank = servers.servers.get(interaction.guild.id).getMembersRanks();
        players = Array.from(players.values()).map(x=>x.getName());
        playersRank = Array.from(playersRank.values()).map(x=>x.getRating());
        let combined = new Map();
        for (let index = 0; index < players.length; index++) {
            combined.set(players[index],playersRank[index]);
        }
        let orderedRanks = new Map([...combined.entries()].sort((a, b) => b[1] - a[1]));
        orderedRanks = Array.from(orderedRanks.entries());
        let embed = new EmbedBuilder();
        embed.setTitle('Rankings');
        embed.setDescription(orderedRanks.join('\n'));
        await interaction.reply('Here are the rankings for this server');
        await interaction.channel.send({embeds: [embed]});
        console.log('sent');
    }
}