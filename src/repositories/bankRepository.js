const { getDatabase } = require('../database/database.js');

const createUserBank = async (userId) => {
    const db = await getDatabase();
    return await db.run(`INSERT OR IGNORE INTO bank (userId) VALUES (?)`,[userId])
}

const updateBank = async (userId, value) => {
    const db = await getDatabase();
    return await db.run(`UPDATE bank SET moedas = ? WHERE userId = ?`, [value, userId])
}

const getUserBank = async (userId) => {
    const db = await getDatabase()
    return await db.get(`SELECT * FROM bank WHERE userId = ?`, [userId])
}

const getAllUsersBank = async () => {
    const db = await getDatabase()
    return await db.all(`SELECT * FROM bank`)
}

module.exports = {
    createUserBank,
    updateBank,
    getUserBank,
    getAllUsersBank
}