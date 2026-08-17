const { getOrCreateUser } = require('../services/economy/balanceService.js');
const {getCooldown, updateLastWork} = require('../repositories/cooldownsRepository.js');
const { updateUserBalanceRepository } = require('../repositories/userRepository.js');

const WORK_COOLDOWN = 60 * 60 * 1000;

const workService = async (userId) => {
    const user = await getOrCreateUser(userId);
    const cooldown = await getCooldown(userId);
    const lastWork = cooldown?.lastWork ?? null;
    const currentTime = Date.now();
    const lastWorkTime = lastWork || 0;

    if (currentTime - lastWorkTime < WORK_COOLDOWN) {
        const remainingTime = WORK_COOLDOWN - (currentTime - lastWorkTime);
        const minutes = Math.floor(remainingTime / 60000);
        const seconds = Math.floor((remainingTime % 60000) / 1000);
        throw new Error(`Você precisa esperar ${minutes} minutos e ${seconds} segundos para trabalhar novamente.`);
    }

    const earnings = Math.floor(Math.random() * (120 - 10 + 1)) + 10;
    const newBalance = user.moedas + earnings;

    await updateUserBalanceRepository(userId, newBalance);
    await updateLastWork(userId, currentTime);

    return { earnings, newBalance, success: true };

}

module.exports = {
    workService
}