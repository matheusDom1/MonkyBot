const { SlashCommandBuilder } = require("discord.js");

const { jogarMoeda } = require("../services/coinFlipService.js");
const { animationMoeda } = require("../utils/animation.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("coinflip")
        .setDescription("Jogue cara ou coroa!")
        
        .addStringOption(option =>
            option
                .setName("escolha")
                .setDescription("Escolha Cara ou Coroa.")
                .setRequired(true)
                .addChoices(
                    { name: "Cara", value: "Cara" },
                    { name: "Coroa", value: "Coroa" }
                )
        )

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
            const choice = interaction.options.getString("escolha");
            const bet = interaction.options.getInteger("aposta");

            await interaction.reply({
                content: "🪙 Jogando a moeda..."
            });

            // Animação
            await animationMoeda(interaction);

            // Executa o jogo
            const resposta = await jogarMoeda(
                userId,
                choice,
                bet
            );

            // Mostra o resultado
            await interaction.editReply(resposta);

        } catch (error) {

            console.error("Erro ao executar coinflip:", error);

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