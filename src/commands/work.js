const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const { workService } = require("../services/workService.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("work")
        .setDescription("Trabalhe pelas suas bananas."),

    async execute(interaction) {
        try {
            const userId = interaction.user.id;

            const result = await workService(userId);
            const earning = result.earnings;

            const messages = {
                low: [
                    `🐵 Depois de muito esforço... bem, na verdade nem tanto. Você ganhou ${earning} bananas.`,
                    `🍌 Seu esforço foi questionável, mas pelo menos você apareceu. Ganhou ${earning} bananas.`,
                    `🐒 Você trabalhou igual macaco com preguiça. Recebeu ${earning} bananas.`
                ],

                medium: [
                    `🐒 Trabalho honesto, bananas honestas. Você ganhou ${earning} bananas.`,
                    `🐵 Você produziu acima da média dos macacos. Recebeu ${earning} bananas.`,
                    `💼 Seu turno acabou e, milagrosamente, você não foi demitido. +${earning} bananas.`
                ],

                high: [
                    `🔥 Hoje você trabalhou como se sua vida dependesse disso! +${earning} bananas.`,
                    `💰 Hoje o salário veio gordo! +${earning} bananas.`,
                    `🐒 Você carregou o servidor nas costas hoje. +${earning} bananas.`
                ],

                jackpot: [
                    `👑 O REI DOS MACACOS! Você fez um trabalho absurdo e recebeu ${earning} BANANAS!`,
                    `🍌🍌🍌 A BANANA ESTÁ CAINDO DO CÉU! Você recebeu ${earning} bananas!`,
                    `👑 Você trabalhou tanto que ganhou o respeito de todos os macacos. +${earning} BANANAS!`
                ]
            };

            let category;

            if (earning <= 30) {
                category = "low";
            } else if (earning <= 80) {
                category = "medium";
            } else if (earning <= 110) {
                category = "high";
            } else {
                category = "jackpot";
            }

            const categoryMessages = messages[category];

            const message =
                categoryMessages[
                    Math.floor(Math.random() * categoryMessages.length)
                ];

            const embed = new EmbedBuilder()
                .setTitle(`💼 Trabalho concluído!`)
                .setDescription(message)
                .setColor("Gold")
                .setTimestamp();

            return interaction.reply({
                embeds: [embed]
            });

        } catch (error) {
            console.error("Erro no comando work:", error);

            return interaction.reply({
                content: `❌ ${error.message}`,
                ephemeral: true
            });
        }
    }
};