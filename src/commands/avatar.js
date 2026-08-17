const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("avatar")
        .setDescription("Mostra o avatar de um usuario.")
        .addUserOption(option => option.setName("user").setDescription("Selecione um usuario para ver o avatar.")),

        async execute(interaction) {
            const user = interaction.options.getUser("user") || interaction.user;
            const avatar = user.displayAvatarURL({ size: 1024 });
            const embed = new EmbedBuilder()
                .setColor("Blue")
                .setTitle(`Avatar de ${user.username}`)
                .setImage(avatar)
                .setFooter({
                    text: `Solicitado por ${interaction.user.username}`
                    })
                .setTimestamp();
            
            await interaction.reply({ embeds: [embed], flags: [64] }).catch(() => {});
        }
}