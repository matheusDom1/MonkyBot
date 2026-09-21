const { getOrCreateUser, updateUserBalance } = require('../../services/economy/balanceService.js');

const giveService = async(userId, targetUserId, amount) => {
    const targetUser = await getOrCreateUser(targetUserId);
    const user = await getOrCreateUser(userId);
    const balanceTargetUser = targetUser.moedas;
    const balanceUser = user.moedas;

    if (balanceUser < amount) {
        throw new Error('Você não tem bananas suficientes para dar.');
    }

    const newBalanceTargetUser = balanceTargetUser + amount;
    const newBalanceUser = balanceUser - amount;

    await updateUserBalance(targetUserId, newBalanceTargetUser);
    await updateUserBalance(userId, newBalanceUser);
}

module.exports = {
    giveService
};