const { delay } = require("./delay");

const symbols = [
    "🍌",
    "🍒",
    "🍉",
    "🔔",
    "🍇",
    "💎"
];

const randomSymbol = () => {
    return symbols[Math.floor(Math.random() * symbols.length)];
};

const animationSlots = async (interaction, finalResult, bet) => {

    // =========================
    // ANIMAÇÃO
    // =========================

    for (let i = 0; i < 6; i++) {

        const animationResult = [
            randomSymbol(),
            randomSymbol(),
            randomSymbol()
        ];

        await interaction.editReply({
            content:
                `🎰 **Girando...**\n` +
                `🍌 Aposta: **${bet} bananas**\n\n` +
                `${animationResult[0]} | ${animationResult[1]} | ${animationResult[2]}`
        });

        await delay(400 + i * 100);
    }

    // =========================
    // RESULTADO FINAL
    // =========================

    await interaction.editReply({
        content:
            `🎰 **Resultado!**\n` +
            `🍌 Aposta: **${bet} bananas**\n\n` +
            `${finalResult[0]} | ${finalResult[1]} | ${finalResult[2]}`
    });

    // Pequena pausa antes de mostrar o embed
    await delay(800);
};

module.exports = {
    animationSlots
};