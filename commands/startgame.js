const {SlashCommandBuilder, EmbedBuilder, Message, ReactionCollector} = require('discord.js');
const Match = require('../match');
const servers = require('..');

module.exports = {
    data : new SlashCommandBuilder()
	.setName('startgame')
	.setDescription('set number of players')
    .addNumberOption(option =>
		option.setName('input')
			.setDescription('The number of players')
			.setRequired(true)),
    async execute(interaction) {
        const playerCount = interaction.options.getNumber('input');

        if (!(playerCount % 2 == 0) || (playerCount > 2)) {
            await interaction.reply('An unfair game was attempted to be created');
        } 
        else {  
        let message = await interaction.reply({content : 'A game with ' + playerCount + ' players has started! You have 30 seconds to join in.', 
        fetchReply : true});
        
        await message.react('✅');

        let filter = (reaction) => {
            return reaction.emoji.name === '✅';
        };

        let participants = await message.awaitReactions({filter, max : playerCount, time : 30000});

        if (participants.first() === undefined || participants.first().users.cache.size - 1 != playerCount){
            await interaction.followUp('Not enough players');
        } else {
            let users = participants.first().users.cache.last(participants.first().users.cache.size - 1);
            let players = users.map(player => [player.username]);
            let player = users.map(player => player.id);
            let description = players.join('\n');
            let lobby = new Match(player,interaction.guildId);
            let [team1 , team2] = lobby.createMatch();
            console.log(team1,team2);
            servers.servers.get(interaction.guildId).RegisterMatch(lobby,interaction.user.id);
            let embed = new EmbedBuilder();
            embed.setTitle('Players');
            embed.setDescription(description);
            embed.addFields({name:'Team 1', value: team1.join('\n')});
            embed.addFields({name: 'Team 2', value: team2.join('\n')});
            await interaction.channel.send({embeds: [embed]});
            console.log('Teams Made');    
        }
    }
    }
}