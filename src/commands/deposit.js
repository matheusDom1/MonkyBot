const { SlashCommandBuilder, EmbedBuilder } = require('discord.js')
const { execute } = require('./daily')
const { depositBank } = require('../services/economy/bankService')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('dep')
        .setDescription('Deposita suas bananas')
        .addIntegerOption( option => option
            .setName('deposito')
            .setDescription('quantidade de bananas enviadas ao banco')
            .setMinValue(1)
            .setRequired(true)
        ),

        async execute(interaction) {
           try {
            const user = interaction.user.id;
            const value = interaction.options.getInteger('deposito');
            const result = await depositBank(user, value);
            const embed = new EmbedBuilder()
                .setTitle(`🍌 Bananas enviadas ao banco!`)
                .setDescription(`Você enviou ${value} bananas ao banco`)
                .addFields({
                    name: '👛 carteira',
                    value: `${result.walletBallance} bananas`,
                    inline: true
                },{
                    name: '🏦 Banco',
                    value: `${result.bankBalance} bananas`,
                    inline: true
                })
                .setColor('Gold')
                .setTimestamp()

            await interaction.reply({
                embeds: [embed]
            })
           } catch (error) {
                console.error('Erro no comando /dep:', error);

                await interaction.reply({
                    content: `❌ ${error.message}`,
                    ephemeral: true
                });
           }
        }
}