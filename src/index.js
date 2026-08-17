require("dotenv").config();

const { Client, GatewayIntentBits, Partials } = require("discord.js");
const { createTable } = require("./database/migrations.js");

const loadCommands = require("./handlers/commandHandler");
const loadButtons = require("./handlers/buttonHandler");
const loadEvents = require("./handlers/eventHandler");

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers,
    ],
    partials: [
        Partials.GuildMember,
        Partials.User,
    ],
});

async function main() {
    try {
        loadCommands(client);
        loadButtons(client);
        loadEvents(client);

        await createTable();

        await client.login(process.env.TOKEN);
    } catch (error) {
        console.error("Erro na inicialização do bot:", error);
    }
}

main();