const {
    SlashCommandBuilder,
    EmbedBuilder
} = require('discord.js');

const fs = require('fs');

// ID DO CARGO AUTORIZADO
const cargoAdmin = '1502362911606182088';

module.exports = {

    data: new SlashCommandBuilder()
        .setName('gerarcodigo')
        .setDescription('Gerar código de autorização'),

    async execute(interaction) {

        // VERIFICAR CARGO
        if (!interaction.member.roles.cache.has(cargoAdmin)) {

            return interaction.reply({
                content: '❌ Você não possui permissão.',
                ephemeral: true
            });
        }

        // GERAR CÓDIGO
        const codigo =
            'AUT-' + Math.floor(Math.random() * 99999);

        // PEGAR DATABASE
        const codigos =
            JSON.parse(
                fs.readFileSync('./database/codigos.json')
            );

        // ADICIONAR
        codigos.push({
            codigo: codigo,
            usado: false,
            criadoPor: interaction.user.id,
            data: new Date()
        });

        // SALVAR
        fs.writeFileSync(
            './database/codigos.json',
            JSON.stringify(codigos, null, 2)
        );

        // EMBED
        const embed = new EmbedBuilder()
            .setColor('#ff0000')
            .setTitle('🔑 Código Gerado')
            .setDescription(
                `Código criado:\n\n\`${codigo}\``
            )
            .setFooter({
                text: 'SSP • Sistema Policial'
            });

        // ENVIAR
        await interaction.reply({
            embeds: [embed],
            ephemeral: true
        });
    }
};