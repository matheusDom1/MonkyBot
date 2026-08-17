const {
    EmbedBuilder,
    AttachmentBuilder
} = require("discord.js");

const {
    getOrCreateUser,
    updateUserBalance
} = require("../services/economy/balanceService");

const path = require("node:path");

const jogarMoeda = async (userId, choice, bet) => {

    // =========================
    // VALIDAR APOSTA
    // =========================

    if (!Number.isInteger(bet) || bet <= 0) {
        throw new Error(
            "A aposta precisa ser um número inteiro maior que zero."
        );
    }

    // =========================
    // BUSCAR USUÁRIO
    // =========================

    const user = await getOrCreateUser(userId);

    // =========================
    // VERIFICAR SALDO
    // =========================

    if (user.moedas < bet) {
        throw new Error(
            `Você não possui bananas suficientes. Seu saldo é ${user.moedas} 🍌.`
        );
    }

    // =========================
    // RESULTADOS
    // =========================

    const results = [
        {
            nome: "Cara",
            imagem: "cara.png",
            cor: "Blue"
        },
        {
            nome: "Coroa",
            imagem: "coroa.png",
            cor: "Gold"
        }
    ];

    // =========================
    // SORTEAR
    // =========================

    const result =
        results[Math.floor(Math.random() * results.length)];

    // =========================
    // CALCULAR SALDO
    // =========================

    let newBalance;
    let won;

    if (result.nome === choice) {

        // Ganhou:
        // aposta de 100 → recebe 200
        const prize = bet * 2;

        newBalance = user.moedas - bet + prize;
        won = true;

    } else {

        // Perdeu a aposta
        newBalance = user.moedas - bet;
        won = false;
    }

    // =========================
    // ATUALIZAR BANCO
    // =========================

    await updateUserBalance(userId, newBalance);

    // =========================
    // IMAGEM
    // =========================

    const imagePath = path.resolve(
        __dirname,
        "../../images/coinflip",
        result.imagem
    );

    const attachment = new AttachmentBuilder(imagePath);

    // =========================
    // EMBED
    // =========================

    const embed = new EmbedBuilder()
        .setColor(result.cor)
        .setTitle(
            won
                ? "🎉 Você ganhou!"
                : "💀 Você perdeu!"
        )
        .setDescription(
            `A moeda caiu em **${result.nome}**!\n\n` +
            `🎰 Aposta: **${bet} bananas**\n` +
            (
                won
                    ? `💰 Você recebeu **${bet * 2} bananas**!`
                    : `💸 Você perdeu **${bet} bananas**.`
            ) +
            `\n🍌 Saldo atual: **${newBalance} bananas**`
        )
        .setTimestamp()
        .setImage(`attachment://${result.imagem}`);

    return {
        content: "",
        embeds: [embed],
        files: [attachment],
        won,
        bet,
        prize: won ? bet * 2 : 0,
        newBalance
    };
};

module.exports = {
    jogarMoeda
};