const { getOrCreateUser } = require("./economy/balanceService.js");

const {
    getCooldown,
    updateLastSteal
} = require("../repositories/cooldownsRepository.js");

const {
    updateUserBalanceRepository
} = require("../repositories/userRepository.js");

const STEAL_COOLDOWN = 60 * 60 * 1000;

const stealService = async (userId, targetId) => {
    const user = await getOrCreateUser(userId);
    const target = await getOrCreateUser(targetId);

    const cooldown = await getCooldown(userId);
    const lastSteal = cooldown?.lastSteal;
    const currentTime = Date.now();

    if (currentTime - lastSteal < STEAL_COOLDOWN) {
        const remainingTime = STEAL_COOLDOWN - (currentTime - lastSteal);
        const minutes = Math.floor(remainingTime / 60000);
        const seconds = Math.floor((remainingTime % 60000) / 1000);
        throw new Error(`Você precisa esperar ${minutes} minutos e ${seconds} segundos para roubar novamente.`);
    }

    if (target.userId === user.userId) {
        throw new Error("Você não pode roubar a si mesmo!");
    }

    if (target.moedas < 1) {
        throw new Error("Esse usuário não possui bananas para roubar!");
    }

    const percentage = Math.random() * (0.20 - 0.05) + 0.05;

    const stolenAmount = Math.max(
        1,
        Math.floor(target.moedas * percentage)
    );

    const newUserBalance = user.moedas + stolenAmount;
    const newTargetBalance = target.moedas - stolenAmount;

    await updateUserBalanceRepository(
        userId,
        newUserBalance
    );

    await updateUserBalanceRepository(
        targetId,
        newTargetBalance
    );

    await updateLastSteal(
        userId,
        Date.now()
    );

    return {
        success: true,
        stolenAmount,
        newBalance: newUserBalance,
        targetBalance: newTargetBalance
    };
};

module.exports = {
    stealService
};