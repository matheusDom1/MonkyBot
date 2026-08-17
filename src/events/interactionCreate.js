const { Events } = require("discord.js");

module.exports = {
    name: Events.InteractionCreate,

    async execute(interaction) {
        const client = interaction.client;

        if (interaction.isChatInputCommand()) {
            const command = client.commands.get(interaction.commandName);
            if (!command) return;

            try {
                await command.execute(interaction);
            } catch (error) {
                console.error(`Erro ao executar o comando ${interaction.commandName}:`, error);
            }
            return;
        }

        if (interaction.isButton()) {
            const button = client.buttons.get(interaction.customId);
            if (!button) return;

            try {
                await button.execute(interaction);
            } catch (error) {
                console.error(`Erro ao processar o botão ${interaction.customId}:`, error);
            }
            return;
        }
    }
};