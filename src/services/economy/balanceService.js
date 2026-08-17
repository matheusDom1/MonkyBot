const { getUser, createUser, updateUserBalanceRepository } = require('../../repositories/userRepository.js');
const { createCooldown } = require('../../repositories/cooldownsRepository.js');

const getOrCreateUser = async (userId) => {
    let user = await getUser(userId);
    
    if (!user) {
        await createUser(userId);
        await createCooldown(userId);
        user = await getUser(userId);
    }
    
    return user;
};

const updateUserBalance = async (userId, amount) => {
    let user = await getUser(userId);
    
    if (!user) {
        await createUser(userId);
        await createCooldown(userId);
        user = await getUser(userId);
    }
    
    return await updateUserBalanceRepository(userId, amount);
}

module.exports = {
    getOrCreateUser,
    updateUserBalance
};
