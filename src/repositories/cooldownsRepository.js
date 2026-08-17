const { getDatabase } = require('../database/database.js');

const createCooldown = async (userId) => {
    const db = await getDatabase();
    return await db.run('INSERT OR IGNORE INTO cooldowns (userId) VALUES (?)', [userId]);
}

const getCooldown = async (userId) => {
    const db = await getDatabase();
    return await db.get('SELECT * FROM cooldowns WHERE userId = ?', [userId]);
}

const updateLastDaily = async (userId, date) => {
    const db = await getDatabase();
    return await db.run('UPDATE cooldowns SET lastDaily = ? WHERE userId = ?', [date, userId]);
}

const updateLastSteal = async (userId, date) => {
    const db = await getDatabase();
    return await db.run('UPDATE cooldowns SET lastSteal = ? WHERE userId = ?', [date, userId]);
}

const updateLastWork = async (userId, date) => {
    const db = await getDatabase();
    return await db.run('UPDATE cooldowns SET lastWork = ? WHERE userId = ?', [date, userId]);
}
module.exports = {
    getCooldown,
    updateLastDaily,
    updateLastSteal,
    updateLastWork,
    createCooldown
};