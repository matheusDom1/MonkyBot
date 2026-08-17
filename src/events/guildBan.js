const { Events, EmbedBuilder } = require("discord.js");

module.exports = {
    name: "Events.GuildBanAdd",
    once: false,
    async execute(member) {
        console.log("BAN DISPAROU:", member.user?.tag ?? member.user?.username);

        const guild = member.guild;
        const channel = guild?.systemChannel ?? guild?.channels?.cache?.find((c) => c.isTextBased && c.isTextBased());

        if (!channel) {
            console.log("Nenhum canal disponível para enviar a mensagem de saída.");
            return;
        }

        const embed = new EmbedBuilder()
            .setColor("Red")
            .setTitle(`Adeus ${member.user.username}!`)
            .setDescription("🐵 Cada macaco que lamba sua banana")
            .setImage(member.user.displayAvatarURL({ size: 1024 }))
            .setFooter({ text: `Agora somos ${guild.memberCount} macacos!` })
            .setTimestamp();

        try {
            await channel.send({ embeds: [embed] });
            console.log("Mensagem de saída enviada com sucesso.");
        } catch (error) {
            console.error("Erro ao enviar mensagem de saída:", error);
        }
    },
};