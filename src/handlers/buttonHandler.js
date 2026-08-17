const fs = require("node:fs");
const path = require("node:path");
const { Collection } = require("discord.js");

module.exports = (client) => {
    client.buttons = new Collection();

    const buttonsPath = path.join(__dirname, "../buttons");
    const buttonFiles = fs.readdirSync(buttonsPath).filter((file) => file.endsWith(".js"));

    for (const file of buttonFiles) {
        const filePath = path.join(buttonsPath, file);
        const button = require(filePath);
        client.buttons.set(button.customId, button);
    }
};
