const { getUserBank,createUserBank, updateBank, getAllUsersBank  } = require('../../repositories/bankRepository')
const { getOrCreateUser, updateUserBalance } = require('../economy/balanceService')

const getOrCreateBank = async (userId) => {
    let user = await getUserBank(userId);
    if(!user) {
        user = await createUserBank(userId);
    }
    return user;
}

const updateUserBank = async (userId, value) => {
    let user = await getUserBank(userId);
    if(!user) {
        user = await createUserBank(userId);
    }
    await updateBank(userId, value);
}

const depositBank = async (userId, value) => {

    if (!Number.isInteger(value) || value <= 0) {
        throw new Error("O valor precisa ser maior que zero.");
    }
    const userWallet = await getOrCreateUser(userId);
    const userBank = await getOrCreateBank(userId)
    
    if(userWallet.moedas < value) {
        throw new Error('Você não tem bananas suficientes na carteira.');
    }
    const newWalletBalance = userWallet.moedas - value;
    const newBankBalance = userBank.moedas + value;
    await updateBank(userId, newBankBalance);
    await updateUserBalance(userId, newWalletBalance);

    return {
        deposited: value,
        walletBallance: newWalletBalance,
        bankBalance: newBankBalance
    }
}

const withdrawBank = async(userId, value) => {
      if (!Number.isInteger(value) || value <= 0) {
        throw new Error("O valor precisa ser maior que zero.");
    }
    const userWallet = await getOrCreateUser(userId);
    const userBank = await getOrCreateBank(userId)
    
    if(userBank.moedas < value) {
        throw new Error('Você não tem bananas suficientes no banco.');
    }
    const newWalletBalance = userWallet.moedas + value;
    const newBankBalance = userBank.moedas - value;
    await updateBank(userId, newBankBalance);
    await updateUserBalance(userId, newWalletBalance);

    return {
        withdrawn: value,
        walletBallance: newWalletBalance,
        bankBalance: newBankBalance
    }
}

module.exports = {
    getOrCreateBank,
    updateUserBank,
    depositBank,
    withdrawBank
}