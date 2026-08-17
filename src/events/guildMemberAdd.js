const { Events, EmbedBuilder } = require("discord.js");

module.exports = {
    name: Events.GuildMemberAdd,
    once: false,

    async execute(member) {
        const channel = member.guild.systemChannel;

        if (!channel) return;

        const avatarURL = member.displayAvatarURL({
            size: 1024,
            forceStatic: false
        });

        const embed = new EmbedBuilder()
            .setColor("Green")
            .setTitle("Bem vindo!")
            .setDescription(
                `🐵 Olá ${member}!\n\nVocê agora se tornou um macaco. Aproveite o servidor!`
            )
            .setImage(avatarURL)
            .setFooter({
                text: `Agora somos ${member.guild.memberCount} macacos!`
            })
            .setTimestamp();

        try {
            await channel.send({
                embeds: [embed]
            });
        } catch (error) {
            console.error(
                "Erro ao enviar mensagem de entrada:",
                error
            );
        }
    },
};