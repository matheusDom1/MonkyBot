const { getDatabase } = require('../database/database.js');

const createUserBank = async () => {
    const db = await getDatabase()
    await db.run(`INSERT INTO bank (userId) VALUES (?)`)
}