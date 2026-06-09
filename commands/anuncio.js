const {
    SlashCommandBuilder,
    ModalBuilder,
    TextInputBuilder,
    TextInputStyle,
    ActionRowBuilder
} = require('discord.js');

// ID DO CARGO
const cargoPermitido = '1502362911606182088';

module.exports = {
    data: new SlashCommandBuilder()
        .setName('anuncio')
        .setDescription('Criar anúncio'),

    async execute(interaction) {

        // VERIFICAR CARGO
        if (!interaction.member.roles.cache.has(cargoPermitido)) {

            return interaction.reply({
                content: '❌ Você não tem permissão para usar este comando.',
                ephemeral: true
            });
        }

        const modal = new ModalBuilder()
            .setCustomId('modalAnuncio')
            .setTitle('SSP • Sistema Policial');

        const titulo = new TextInputBuilder()
            .setCustomId('titulo')
            .setLabel('Título')
            .setStyle(TextInputStyle.Short)
            .setRequired(true);

        const descricao = new TextInputBuilder()
            .setCustomId('descricao')
            .setLabel('Descrição')
            .setStyle(TextInputStyle.Paragraph)
            .setRequired(true);

        const imagem = new TextInputBuilder()
            .setCustomId('imagem')
            .setLabel('Imagem (opcional)')
            .setStyle(TextInputStyle.Short)
            .setRequired(false);

        const link = new TextInputBuilder()
            .setCustomId('link')
            .setLabel('Link do botão')
            .setStyle(TextInputStyle.Short)
            .setRequired(false);

        const row1 = new ActionRowBuilder().addComponents(titulo);
        const row2 = new ActionRowBuilder().addComponents(descricao);
        const row3 = new ActionRowBuilder().addComponents(imagem);
        const row4 = new ActionRowBuilder().addComponents(link);

        modal.addComponents(row1, row2, row3, row4);

        await interaction.showModal(modal);
    }
};