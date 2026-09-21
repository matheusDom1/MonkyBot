const { getDatabase } = require("../database/database.js");

const getTopUsers = async (limit = 10) => {
    const db = await getDatabase();

    return await db.all(`
        SELECT 
            users.userId,
            users.moedas AS wallet,
            COALESCE(bank.moedas, 0) AS bank,
            users.moedas + COALESCE(bank.moedas, 0) AS patrimonio
        FROM users
        LEFT JOIN bank 
            ON users.userId = bank.userId
        ORDER BY patrimonio DESC, users.userId ASC
        LIMIT ?
    `, [limit]);
};

const getUserPosition = async (userId) => {
    const db = await getDatabase();

    const user = await db.get(`
        SELECT 
            users.userId,
            users.moedas AS wallet,
            COALESCE(bank.moedas, 0) AS bank,
            users.moedas + COALESCE(bank.moedas, 0) AS patrimonio
        FROM users
        LEFT JOIN bank 
            ON users.userId = bank.userId
        WHERE users.userId = ?
    `, [userId]);

    if (!user) return null;

    const result = await db.get(`
        SELECT COUNT(*) + 1 AS position
        FROM users
        LEFT JOIN bank
            ON users.userId = bank.userId
        WHERE 
            users.moedas + COALESCE(bank.moedas, 0) > ?
            OR (
                users.moedas + COALESCE(bank.moedas, 0) = ?
                AND users.userId < ?
            )
    `, [
        user.patrimonio,
        user.patrimonio,
        user.userId
    ]);

    return {
        userId: user.userId,
        wallet: user.wallet,
        bank: user.bank,
        patrimonio: user.patrimonio,
        position: result.position
    };
};

module.exports = {
    getTopUsers,
    getUserPosition
};