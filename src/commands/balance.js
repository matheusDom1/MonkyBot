const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { getOrCreateUser } = require('../services/economy/balanceService.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('balance')
        .setDescription('Mostra o saldo de bananas do usuario.'),

    async execute(interaction) {
        if (interaction.deferred || interaction.replied) return;

        await interaction.deferReply().catch(() => {});

        try {
            const userId = interaction.user.id;
            const user = await getOrCreateUser(userId);

            const embed = new EmbedBuilder()
                .setTitle(`Carteira de ${interaction.user.username}`)
                .setDescription(`Seu saldo é de **${user?.moedas ?? 0}** 🍌 bananas.`)
                .setColor('Yellow')
                .setThumbnail(interaction.user.displayAvatarURL({ dynamic: true }))
                .setTimestamp();

            await interaction.editReply({ embeds: [embed] }).catch(() => {});
        } catch (error) {
            console.error('Erro no comando balance:', error);
            await interaction.editReply({
                content: 'Ocorreu um erro ao consultar seu saldo.'
            }).catch(() => {});
        }
    }
};