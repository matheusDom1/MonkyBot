const { SlashCommandBuilder, EmbedBuilder } = require('discord.js')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('commands')
        .setDescription('Todos os comandos do nosso bot!')
        ,

        async execute(interaction) {
            const embed = new EmbedBuilder()
                .setTitle('🐒 Comandos')
                .addFields({
                    name:"/daily",
                    value:"Colete suas bananas diarias",
                    inline: false
                },{
                    name:"/work",
                    value:"Trabalhe duro pelas suas bananas!",
                    inline: false
                },{
                    name:"/steal",
                    value:"Roube bananas de outros macacos — se tiver coragem!",
                    inline: false
                },{
                    name:"/balance",
                    value:"Veja seu saldo de bananas ou a de outro macaco",
                    inline: false
                },{
                    name:"/dep",
                    value:"Proteja suas bananas no banco!! Aqui ninguem pode rouba-las",
                    inline: false
                }, {
                    name:"/withdraw",
                    value:"Retire suas bananas do banco para poder gastá-las",
                    inline: false
                },{
                    name:"/slots",
                    value:"Aposte suas bananas no caça-níqueis. Está com sorte hoje? Tente multiplicar suas bananas!!",
                    inline: false
                },{
                    name:"/coinflip",
                    value:"Aposte em cara ou coroa e tente dobrar suas bananas!",
                    inline: false
                },{
                    name:"/ranking",
                    value:"Veja quem é o mais rico entre os macacos",
                    inline: false
                })
                .setColor('DarkPurple')

                await interaction.reply({
                    embeds: [embed]
                })
        }
}