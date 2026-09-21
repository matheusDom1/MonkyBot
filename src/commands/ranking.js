const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const { rankingService } = require("../services/economy/rankingService.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("ranking")
        .setDescription("Mostra os macacos mais ricos do servidor."),

    async execute(interaction) {
        try {
            const userId = interaction.user.id;

            const { topUsers, userPosition } =
                await rankingService(userId);

            const positionEmojis = {
                1: "🥇",
                2: "🥈",
                3: "🥉",
                4: "4️⃣",
                5: "5️⃣",
                6: "6️⃣",
                7: "7️⃣",
                8: "8️⃣",
                9: "9️⃣",
                10: "🔟"
            };

            let description = "";

            for (let i = 0; i < topUsers.length; i++) {
                const user = topUsers[i];

                const member = await interaction.guild.members
                    .fetch(user.userId)
                    .catch(() => null);

                const username = member
                    ? member.user.username
                    : "Macaco desconhecido";

                const position = i + 1;

                const positionEmoji =
                    positionEmojis[position] || `${position}.`;

                description +=
                    `${positionEmoji} **${username}** — 🍌 ${user.patrimonio}\n`;
            }

            if (topUsers.length === 0) {
                description = "🐵 Ainda não existem macacos no ranking!";
            }

            const embed = new EmbedBuilder()
                .setTitle("🏆 Ranking dos Macacos")
                .setDescription(description)
                .setColor("Gold")
                .setTimestamp();

            if (userPosition) {
                embed.addFields({
                    name: "🐒 Sua posição",
                    value: `#${userPosition.position} — 🍌 ${userPosition.patrimonio} bananas`,
                    inline: false
                });
            }

            await interaction.reply({
                embeds: [embed]
            });

        } catch (error) {
            console.error("Erro ao executar o ranking:", error);

            if (!interaction.replied && !interaction.deferred) {
                await interaction.reply({
                    content: "❌ Ocorreu um erro ao carregar o ranking.",
                    ephemeral: true
                });
            }
        }
    }
};