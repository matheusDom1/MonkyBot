const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const { dailyService } = require("../services/dailyService.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("daily")
        .setDescription("Pegue suas bananas diárias!"),

    async execute(interaction) {
        if (interaction.deferred || interaction.replied) return;

        try {
            await interaction.deferReply();

            const userId = interaction.user.id;
            const result = await dailyService(userId);

            if (!result.claimed) {
                return interaction.editReply({
                    content: result.message
                });
            }

            const embed = new EmbedBuilder()
                .setTitle("🍌 Recompensa Diária Coletada!")
                .setDescription(
                    `Você recebeu **${result.reward} bananas**!`
                )
                .setColor("Yellow")
                .setTimestamp();

            await interaction.editReply({
                embeds: [embed]
            });

        } catch (error) {
            console.error("Erro ao executar o comando daily:", error);

            if (interaction.deferred || interaction.replied) {
                await interaction.editReply({
                    content: `❌ ${error.message}`
                }).catch(() => {});
            }
        }
    },
};