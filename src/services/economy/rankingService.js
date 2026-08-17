const {
    getTopUsers,
    getUserPosition
} = require("../../repositories/rankingRepository.js");

const rankingService = async (userId) => {
    const topUsers = await getTopUsers(10);
    const userPosition = await getUserPosition(userId);

    return {
        topUsers,
        userPosition
    };
};

module.exports = {
    rankingService
};