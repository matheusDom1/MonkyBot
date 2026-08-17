const { getDatabase } = require("./database");

const createTable = async () => {
    const db = await getDatabase();

    await db.exec(`
        CREATE TABLE IF NOT EXISTS users (
            userId TEXT PRIMARY KEY,
            moedas INTEGER DEFAULT 0
        );
    `);

    await db.exec(`CREATE TABLE IF NOT EXISTS cooldowns (
        userId TEXT PRIMARY KEY,
        lastSteal INTEGER,
        lastDaily INTEGER,
        lastWork INTEGER,
        FOREIGN KEY (userId) REFERENCES users(userId)
    );`);

    console.log("✔ Banco de dados inicializado.");
};

module.exports = {
    createTable
};