const { getDatabase } = require("../database/database.js");

const getTopUsers = async (limit = 10) => {
    const db = await getDatabase();

    return await db.all(`
        SELECT userId, moedas
        FROM users
        ORDER BY moedas DESC, userId ASC
        LIMIT ?
    `, [limit]);
};

const getUserPosition = async (userId) => {
    const db = await getDatabase();

    const user = await db.get(
        "SELECT userId, moedas FROM users WHERE userId = ?",
        [userId]
    );

    if (!user) return null;

    const result = await db.get(`
        SELECT COUNT(*) + 1 AS position
        FROM users
        WHERE moedas > ?
           OR (moedas = ? AND userId < ?)
    `, [
        user.moedas,
        user.moedas,
        user.userId
    ]);

    return {
        userId: user.userId,
        moedas: user.moedas,
        position: result.position
    };
};

module.exports = {
    getTopUsers,
    getUserPosition
};