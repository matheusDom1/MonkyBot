const {
    SlashCommandBuilder,
    PermissionFlagsBits
} = require("discord.js");

const {
    getOrCreateBank,
    updateUserBank
} = require("../services/economy/bankService.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("addbananas")
        .setDescription("Adiciona bananas ao banco de um usuário.")
        .addUserOption(option =>
            option
                .setName("usuario")
                .setDescription("Usuário que receberá as bananas.")
                .setRequired(true)
        )
        .addIntegerOption(option =>
            option
                .setName("quantidade")
                .setDescription("Quantidade de bananas a adicionar.")
                .setMinValue(1)
                .setRequired(true)
        )
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

    async execute(interaction) {
        try {
            if (!interaction.member.permissions.has(PermissionFlagsBits.Administrator)) {
                return interaction.reply({
                    content: "❌ Apenas administradores podem usar este comando.",
                    flags: 64
                });
            }

            const selectedUser = interaction.options.getUser("usuario");
            const amount = interaction.options.getInteger("quantidade");

            const bank = await getOrCreateBank(selectedUser.id);

            const currentBalance = bank.moedas ?? 0;
            const newBalance = currentBalance + amount;

            await updateUserBank(selectedUser.id, newBalance);

            return interaction.reply({
                content: `✅ **${amount} bananas** foram adicionadas ao banco de ${selectedUser}.`,
                flags: 64
            });

        } catch (error) {
            console.error("Erro no comando /addbananas:", error);

            if (interaction.replied || interaction.deferred) {
                return interaction.editReply({
                    content: "❌ Ocorreu um erro ao adicionar as bananas."
                }).catch(() => {});
            }

            return interaction.reply({
                content: "❌ Ocorreu um erro ao adicionar as bananas.",
                flags: 64
            });
        }
    }
};