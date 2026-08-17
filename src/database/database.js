// conexão com o sqlite (usando sqlite + sqlite3)
const sqlite3 = require("sqlite3");
const { open } = require("sqlite");
const path = require("node:path");

let dbInstance = null;

/**
 * Retorna a instância ativa do banco de dados SQLite.
 * Cria a conexão e ativa o modo WAL na primeira chamada.
 */
async function getDatabase() {
    if (!dbInstance) {
        dbInstance = await open({
            filename: path.join(__dirname, "database.db"),
            driver: sqlite3.Database
        });

        // Ativa o modo WAL para melhor performance de escrita e leitura
        await dbInstance.exec("PRAGMA journal_mode = WAL;");
    }
    
    return dbInstance;
}

module.exports = { getDatabase };