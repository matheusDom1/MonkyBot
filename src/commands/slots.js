const {
    SlashCommandBuilder,
    EmbedBuilder
} = require("discord.js");

const { slotsService } = require("../services/economy/slotsService.js");
const { animationSlots } = require("../utils/animationSlots.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("slots")
        .setDescription("Aposte suas bananas na máquina de slots.")
        .addIntegerOption(option =>
            option
                .setName("aposta")
                .setDescription("Quantidade de bananas que deseja apostar.")
                .setMinValue(1)
                .setRequired(true)
        ),

    async execute(interaction) {

        try {

            const userId = interaction.user.id;
            const bet = interaction.options.getInteger("aposta");

            await interaction.reply({
                content: "🎰 Preparando a máquina..."
            });

            // =========================
            // EXECUTAR O JOGO
            // =========================

            const result = await slotsService(
                userId,
                bet
            );

            // =========================
            // ANIMAÇÃO
            // =========================

            await animationSlots(
                interaction,
                result.result,
                result.bet
            );

            // =========================
            // RESULTADO
            // =========================

            let title;
            let description;
            let color;

            switch (result.resultType) {

                case "jackpot":

                    title = "🎉 JACKPOT! 🎉";

                    description =
                        `🍌 **Três símbolos iguais!**\n\n` +
                        `Você ganhou **${result.prize} bananas**!`;

                    color = "Gold";

                    break;

                case "two_equal":

                    title = "🐵 Boa!";

                    description =
                        `Você conseguiu **dois símbolos iguais!**\n\n` +
                        `💰 Você ganhou **${result.prize} bananas**!`;

                    color = "Green";

                    break;

                case "nothing":

                    title = "💀 Você perdeu!";

                    description =
                        `Nenhum símbolo combinou.\n\n` +
                        `💸 Você perdeu **${result.bet} bananas**.`;

                    color = "Red";

                    break;
            }

            const embed = new EmbedBuilder()
                .setTitle(title)
                .setDescription(description)
                .addFields(
                    {
                        name: "🎰 Aposta",
                        value: `🍌 ${result.bet} bananas`,
                        inline: true
                    },
                    {
                        name: "💰 Saldo atual",
                        value: `🍌 ${result.newBalance} bananas`,
                        inline: true
                    }
                )
                .setColor(color)
                .setTimestamp();

            await interaction.editReply({
                content: "",
                embeds: [embed]
            });

        } catch (error) {

            console.error(
                "Erro ao executar o comando slots:",
                error
            );

            if (interaction.replied) {

                await interaction.editReply({
                    content: `❌ ${error.message}`
                });

            } else {

                await interaction.reply({
                    content: `❌ ${error.message}`,
                    ephemeral: true
                });

            }
        }
    }
};