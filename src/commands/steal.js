const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const { getOrCreateUser } = require("../services/economy/balanceService.js");
const { stealService } = require("../services/stealService.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("steal")
        .setDescription("Rouba a banana do usuario mencionado.")
        .addUserOption((option) =>
            option
                .setName("user")
                .setDescription("Selecione um usuario para roubar a banana.")
        ),

    async execute(interaction) {
        const target = interaction.options.getUser("user");

        if (!target) {
            return interaction.reply({
                content: "🐵 Você precisa escolher um usuário para roubar!",
                ephemeral: true,
            });
        }

        try {
            const result = await stealService(interaction.user.id, target.id);
            if (result.success) {
                const embed = new EmbedBuilder()
                .setDescription(`🐵 Você roubou **${result.stolenAmount}** bananas de ${target.username}!`)
                .setColor(0x00ff00);

                return interaction.reply({ embeds: [embed] });
            }
        } catch (error) {
            console.error("Erro no stealService:", error);

            return interaction.reply({
                content: `❌ ${error.message}`,
                ephemeral: true,
            });
        }
    },
};