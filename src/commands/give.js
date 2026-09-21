const { SlashCommandBuilder, EmbedBuilder, AttachmentBuilder } = require('discord.js');
const {giveService} = require('../services/economy/giveService.js');
const path = require('node:path');


module.exports = {
    data: new SlashCommandBuilder()
        .setName('give')
        .setDescription('Dá bananas para outro usuário.')
        .addUserOption(option =>
            option.setName('usuário')
                .setDescription('O usuário para quem você quer dar bananas.')
                .setRequired(true))
        .addIntegerOption(option =>
            option.setName('quantidade')
                .setDescription('A quantidade de bananas que você quer dar.')
                .setRequired(true)),
    async execute(interaction) {
        const userId = interaction.user.id;
        const targetUserId = interaction.options.getUser('usuário').id;
        const amount = interaction.options.getInteger('quantidade');
        const imagePath = path.resolve(__dirname, '../../images/coinflip/give.png');
        const attachment = new AttachmentBuilder(imagePath);

        const embed = new EmbedBuilder()
            .setColor('#0099ff')
            .setTitle(`✅${interaction.user.username} deu ${amount} bananas para ${interaction.options.getUser('usuário').username}!  `)
            .setImage('attachment://give.png');
        if (userId === targetUserId) {
            return interaction.reply({ content: 'Você não pode dar bananas para si mesmo.', ephemeral: true });
        }

        try {
            await giveService(userId, targetUserId, amount);
            return interaction.reply({ embeds: [embed], files: [attachment] });
        } catch (error) {
            console.error('Erro ao dar bananas:', error);
            return interaction.reply({ content: 'Ocorreu um erro ao tentar dar bananas. Por favor, tente novamente mais tarde.', ephemeral: true });
        }
    }
}