const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { withdrawBank } = require('../services/economy/bankService');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('sacar')
        .setDescription('Saca suas bananas do banco')
        .addIntegerOption(option =>
            option
                .setName('saque')
                .setDescription('Quantidade de bananas retiradas do banco')
                .setMinValue(1)
                .setRequired(true)
        ),

    async execute(interaction) {
        try {
            const user = interaction.user.id;
            const value = interaction.options.getInteger('saque');

            const result = await withdrawBank(user, value);

            const embed = new EmbedBuilder()
                .setTitle('🍌 Bananas retiradas do banco!')
                .setDescription(
                    `Você sacou **${value} bananas** do banco.`
                )
                .addFields(
                    {
                        name: '👛 Carteira',
                        value: `${result.walletBallance} bananas`,
                        inline: true
                    },
                    {
                        name: '🏦 Banco',
                        value: `${result.bankBalance} bananas`,
                        inline: true
                    }
                )
                .setColor('Gold')
                .setTimestamp();

            await interaction.reply({
                embeds: [embed]
            });

        } catch (error) {
            console.error('Erro no comando /sacar:', error);

            await interaction.reply({
                content: `❌ ${error.message}`,
                ephemeral: true
            });
        }
    }
};