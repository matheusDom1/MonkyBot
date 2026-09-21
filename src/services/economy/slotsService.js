const {
    getOrCreateUser,
    updateUserBalance
} = require("../economy/balanceService.js");

const SYMBOLS = [
    "🍌",
    "🍒",
    "🍉",
    "🔔",
    "🍇",
    "💎"
];

const MULTIPLIERS = {
    THREE_EQUAL: 10,
    TWO_EQUAL: 3.0,
    NOTHING: 0
};

const slotsService = async (userId, bet) => {

    // =========================
    // VALIDAÇÃO DA APOSTA
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
            `Você não possui bananas suficientes. Seu saldo atual é ${user.moedas} 🍌.`
        );
    }

    // =========================
    // SORTEAR OS SÍMBOLOS
    // =========================

    const result = [
        SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)],
        SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)],
        SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)]
    ];

    const [first, second, third] = result;

    // =========================
    // DETERMINAR RESULTADO
    // =========================

    let multiplier;
    let resultType;

    // 3 iguais
    if (
        first === second &&
        second === third
    ) {

        multiplier = MULTIPLIERS.THREE_EQUAL;
        resultType = "jackpot";

    // exatamente 2 iguais
    } else if (
        first === second ||
        first === third ||
        second === third
    ) {

        multiplier = MULTIPLIERS.TWO_EQUAL;
        resultType = "two_equal";

    // nenhum igual
    } else {

        multiplier = MULTIPLIERS.NOTHING;
        resultType = "nothing";
    }

    // =========================
    // CALCULAR PRÊMIO
    // =========================

    const prize = Math.floor(bet * multiplier);

    // =========================
    // ATUALIZAR SALDO
    // =========================

    const newBalance = user.moedas - bet + prize;

    await updateUserBalance(userId, newBalance);

    // =========================
    // RETORNAR RESULTADO
    // =========================

    return {
        result,
        bet,
        prize,
        multiplier,
        newBalance,
        resultType
    };
};

module.exports = {
    slotsService,
    SYMBOLS
};