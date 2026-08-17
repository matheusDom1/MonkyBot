const {delay} = require("../utils/delay");

const animationMoeda = async (interaction) => {
                const emoji = ['🪙', '⚪'];
                let contador = 0;
                let time = 150;
                while (contador < 5) {
                    contador++;
                    await delay(time);
                    time += 150;
                    await interaction.editReply({ content: `${emoji[contador % emoji.length]}` });
                }
}

module.exports = { animationMoeda }