const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { getOrCreateUser } = require('../services/economy/balanceService.js');
const { getOrCreateBank } = require('../services/economy/bankService.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('balance')
        .setDescription('Mostra o saldo de bananas de um usuário.')
        .addUserOption(option =>
            option
                .setName('usuario')
                .setDescription('Usuário que você deseja consultar')
                .setRequired(false)
        ),

    async execute(interaction) {
        try {
            // Usuário selecionado ou o próprio usuário
            const selectedUser =
                interaction.options.getUser('usuario') || interaction.user;

            const userId = selectedUser.id;

            // Busca carteira e banco
            const userWallet = await getOrCreateUser(userId);
            const userBank = await getOrCreateBank(userId);

            // Valores
            const wallet = userWallet.moedas ?? 0;
            const bank = userBank.moedas ?? 0;
            const total = wallet + bank;

            // Detecta se o avatar é animado
            const avatarExtension = selectedUser.avatar?.startsWith('a_')
                ? 'gif'
                : 'png';

            const avatarURL = selectedUser.displayAvatarURL({
                extension: avatarExtension,
                size: 512
            });

            // Embed
            const embed = new EmbedBuilder()
                .setTitle(`🍌 Saldo de ${selectedUser.username}`)
                .setImage(avatarURL)
                .addFields(
                    {
                        name: '👛 Carteira',
                        value: `**${wallet}** bananas`,
                        inline: true
                    },
                    {
                        name: '🏦 Banco',
                        value: `**${bank}** bananas`,
                        inline: true
                    },
                    {
                        name: '💰 Total',
                        value: `**${total}** bananas`,
                        inline: false
                    }
                )
                .setColor('Yellow')
                .setTimestamp();

            await interaction.reply({
                embeds: [embed]
            });

        } catch (error) {
            console.error('Erro no comando /balance:', error);

            const message = {
                content: '❌ Ocorreu um erro ao consultar o saldo.',
                ephemeral: true
            };

            if (interaction.replied || interaction.deferred) {
                await interaction.editReply(message);
            } else {
                await interaction.reply(message);
            }
        }
    }
};