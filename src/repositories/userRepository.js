const { getDatabase } = require('../database/database.js');

const getUser = async (userId) => {
    const db = await getDatabase();
    return await db.get("SELECT * FROM users WHERE userId = ?", [userId]);
};

const createUser = async (userId) => {
    const db = await getDatabase();
    return await db.run("INSERT OR IGNORE INTO users (userId) VALUES (?)", [userId]);
};

const updateUserBalanceRepository = async (userId, amount) => {
    const db = await getDatabase();
    return await db.run("UPDATE users SET moedas = ? WHERE userId = ?", [amount, userId]);
}

const updateDate = async (userId, date) => {
    const db = await getDatabase();
    return await db.run("UPDATE users SET lastDaily = ? WHERE userId = ?", [date, userId]);
}


module.exports = {
    getUser,
    createUser,
    updateUserBalanceRepository,
    updateDate,
};

